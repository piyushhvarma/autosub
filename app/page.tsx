"use client"

import { useState } from "react"
import { upload } from "@vercel/blob/client" // 👈 The Secret Weapon
import { LandingPage } from "@/components/landing-page"
import { ProcessingState } from "@/components/processing-state"
import { EditorDashboard } from "@/components/editor-dashboard"

export type AppStage = "landing" | "processing" | "editor"

export interface UploadedFile {
  name: string
  size: number
  type: string
  url: string
}

export default function Home() {
  const [stage, setStage] = useState<AppStage>("landing")
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [subtitles, setSubtitles] = useState<any[]>([]) 

  const handleFileUpload = async (file: File) => {
    // 1. Immediate Local Preview (so user sees something instantly)
    // We create a local URL just for the preview player
    const localPreviewUrl = URL.createObjectURL(file)
    
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      url: localPreviewUrl, 
    })
    
    // 2. Switch to Processing UI
    setStage("processing")

    try {
      // --- STEP A: Upload to Vercel Blob (Bypasses 4.5MB limit) ---
      // This sends the file to the cloud storage directly
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload', // Points to the route we created earlier
      })

      console.log("✅ File uploaded to Blob:", blob.url)

      // --- STEP B: Send the BLOB URL to your AI Backend ---
      // We are NO longer sending 'FormData'. We are sending JSON with the URL.
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl: blob.url }), // 👈 Sending URL, not File
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Transcription failed")
      }

      // --- STEP C: Success! ---
      setSubtitles(data.segments || []) 
      
      // Update the file URL to the real Blob URL (better for sharing/exporting later)
      setUploadedFile(prev => prev ? { ...prev, url: blob.url } : null)
      
      setStage("editor")

    } catch (error) {
      console.error("Processing failed:", error)
      alert("Error processing video. Check console for details.")
      setStage("landing") 
      setUploadedFile(null)
    }
  }

  const handleBackToUpload = () => {
    setStage("landing")
    setUploadedFile(null)
    setSubtitles([])
  }

  return (
    <main className="min-h-screen bg-background">
      {stage === "landing" && <LandingPage onFileUpload={handleFileUpload} />}
      
      {stage === "processing" && uploadedFile && (
        <ProcessingState fileName={uploadedFile.name} />
      )}
      
      {stage === "editor" && uploadedFile && (
        <EditorDashboard 
          file={uploadedFile} 
          subtitles={subtitles} 
          onBack={handleBackToUpload} 
        />
      )}
    </main>
  )
}