import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

// Keep runtime as nodejs for buffer support
export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // 1. CHANGED: Parse JSON instead of FormData
    // The frontend now sends { videoUrl: "https://..." }
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "No video URL provided" }, { status: 400 });
    }

    console.log(">> Downloading video from Blob:", videoUrl);

    // 2. NEW: Fetch the actual file from the Blob URL
    const videoResponse = await fetch(videoUrl);
    
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    // Convert the download stream into a Buffer for OpenAI
    const arrayBuffer = await videoResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Trick OpenAI (Same as before)
    const openaiFile = await toFile(buffer, "input.mp4", {
      type: "video/mp4", 
    });

    console.log(">> Sending to OpenAI (Hinglish Mode)...");

    // 🔥 THE HINGLISH TRICK (Kept exactly the same) 🔥
    const transcription = await openai.audio.transcriptions.create({
      file: openaiFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularity: "segment",
      prompt: "Hello dosto, kaise ho aap sab? Aaj hum coding seekhenge. Video ko like karo. Yeh Hinglish transcription hai.", 
      language: "hi", 
    });

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