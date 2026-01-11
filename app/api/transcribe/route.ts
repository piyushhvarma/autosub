import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Trick OpenAI into thinking it's an MP4 (even for MOV files)
    const openaiFile = await toFile(buffer, "input.mp4", {
      type: "video/mp4", 
    });

    console.log(">> Sending to OpenAI (Hinglish Mode)...");

    // 🔥 THE HINGLISH TRICK 🔥
    // We give it a 'prompt' full of Hinglish sentences.
    // The AI sees this and thinks: "Oh, we are writing Hindi in English today!"
    const transcription = await openai.audio.transcriptions.create({
      file: openaiFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularity: "segment",
      prompt: "Hello dosto, kaise ho aap sab? Aaj hum coding seekhenge. Video ko like karo. Yeh Hinglish transcription hai.", 
      language: "hi", // We tell it the audio is Hindi...
    });
    // Note: Even with this, Whisper sometimes reverts to Devanagari. It's stubborn.

    console.log(">> Success! Received transcription.");

    return NextResponse.json({
      task: "transcribe",
      text: transcription.text,
      segments: transcription.segments,
    });

  } catch (error: any) {
    console.error(">> Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}