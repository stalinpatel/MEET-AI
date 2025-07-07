import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
  CallSessionStartedEvent,
  CallSessionParticipantLeftEvent,
  // CallRecordingReadyEvent,
  // StreamClient,
  // CallEndedEvent,
  // MessageNewEvent,
} from "@stream-io/node-sdk";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream.video";
import { askGemini } from "@/lib/gemini";
import { generateMurfAudio } from "@/lib/murf";
import { z } from "zod";
import { getIOInstance } from "@/lib/io";

export const ClosedCaptionSchema = z.object({
  type: z.literal("call.closed_caption"),
  call_cid: z.string(), // → Extract meetingId from here
  closed_caption: z.object({
    text: z.string(),
  }),
});

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or API key" },
      { status: 400 }
    );
  }
  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;
  console.log("🎯 Incoming Stream Webhook:", eventType, payload);
  // ✅ Handle transcription events
  if (eventType === "call.closed_caption") {
    const result = ClosedCaptionSchema.safeParse(payload);

    if (!result.success) {
      console.error("❌ Closed caption payload invalid", result.error);
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { call_cid, closed_caption } = result.data;
    const meetingId = call_cid.split(":")[1]; // 🧠 Extracted
    const transcription = closed_caption.text;

    console.log({ meetingId, transcription });

    if (!transcription || !meetingId) {
      return NextResponse.json(
        { error: "Missing transcription or meetingId" },
        { status: 400 }
      );
    }

    try {
      // 🧠 Get Gemini reply
      const aiReply = await askGemini(transcription);

      console.log("Gemini replied :", aiReply);
      // 🗣️ Get Murf audio
      // const audioUrl = await generateMurfAudio(aiReply);
      const audioUrl = "audio_url";

      if (audioUrl) {
        console.log("Audio a:", audioUrl);

        const io = getIOInstance();
        if (io) {
          io.to(meetingId).emit("voice-reply", audioUrl);
        }
      }

      console.log("✅ Transcription handled, reply sent");
    } catch (err) {
      console.error("❌ Failed to handle transcription:", err);
    }
  } else if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing"))
        )
      );
    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date(),
      })
      .where(eq(meetings.id, existingMeeting.id));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // const call = streamVideo.video.call("default", meetingId);

    // try {
    //   const realtimeClient = await streamVideo.video.connectOpenAi({
    //     call,
    //     openAiApiKey: process.env.OPENAI_API_KEY!,
    //     agentUserId: existingAgent.id,
    //   });
    //   realtimeClient.updateSession({
    //     instructions: existingAgent.instructions,
    //   });
    //   console.log("✅ OpenAI session connected and instructions sent.");
    // } catch (error) {
    //   console.error("Failed to connect OpenAI:", error);
    // }
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }
    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  }
  return NextResponse.json({ status: "ok" });
}
