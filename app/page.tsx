"use client"

import { useState } from "react"
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
  // 1. New State for the AI Data
  const [subtitles, setSubtitles] = useState<any[]>([]) 

  const handleFileUpload = async (file: File) => {
    // A. Setup the local preview (so user can see video immediately)
    const fileUrl = URL.createObjectURL(file)
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl,
    })
    
    // B. Switch to loading screen
    setStage("processing")

    try {
      // C. THE REAL BACKEND CONNECTION 🚀
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      // D. Success! Save data and move to editor
      setSubtitles(data.segments) // <--- This saves the OpenAI timestamps
      setStage("editor")

    } catch (error) {
      console.error("Transcription failed:", error)
      alert("Error processing video. Check console for details.")
      setStage("landing") // Go back if it fails
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
          subtitles={subtitles} // <--- Passing the real data here!
          onBack={handleBackToUpload} 
        />
      )}
    </main>
  )
}