// lib/murf.ts
import axios from "axios";

export const generateMurfAudio = async (text: string) => {
  try {
    const res = await axios.post(
      "https://api.murf.ai/v1/speech/generate",
      {
        text,
        voiceId: "en-US-natalie", // Or another voice from docs
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": process.env.MURF_TTS_API_KEY!,
        },
      }
    );

    return res.data.audioFile; // ✅ Returns audio URL
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Murf API error (Axios):",
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      console.error("Murf API error:", error.message);
    } else {
      console.error("Unknown Murf error:", error);
    }
  }
};
