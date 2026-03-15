import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as Blob;
    const language = formData.get("language") as string || "en";

    if (!audio) {
      return NextResponse.json({ error: "Audio is required" }, { status: 400 });
    }

    const file = new File([audio], "audio.webm", { type: "audio/webm" });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: language !== "auto" ? language : undefined,
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("Speech-to-text error:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
