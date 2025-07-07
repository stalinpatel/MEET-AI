import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";

export async function GET() {
  const reply = await askGemini("What is the future of Computer in Villages?");
  return NextResponse.json({ reply });
}
