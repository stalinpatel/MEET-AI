"use client";
import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";
import { useEffect } from "react";
import io from "socket.io-client";
interface Props {
  meetingId: string;
}

export const CallView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );
  useEffect(() => {
    fetch("/api/socket"); // boot the server first

    const socket = io({
      path: "/api/socket", // 👈 match exactly with server
    });

    socket.on("connect", () => {
      console.log("✅ Connected to websocket", socket.id);
      socket.emit("join-room", meetingId);
    });

    socket.on("voice-reply", (audioUrl: string) => {
      const audio = new Audio(audioUrl);
      audio.play();
    });

    return () => {
      socket.disconnect();
    };
  }, [meetingId]);

  if (data.status === "completed") {
    return (
      <div className="flex h-screen justify-center">
        <ErrorState
          title={"Meeting has ended"}
          description="You can no longer join this meeting "
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <CallProvider meetingId={meetingId} meetingName={data.name} />
    </div>
  );
};
