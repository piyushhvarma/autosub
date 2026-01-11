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

  const handleFileUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file)
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl,
    })
    setStage("processing")

    // Simulate processing completion
    setTimeout(() => {
      setStage("editor")
    }, 8000)
  }

  const handleBackToUpload = () => {
    setStage("landing")
    setUploadedFile(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {stage === "landing" && <LandingPage onFileUpload={handleFileUpload} />}
      {stage === "processing" && uploadedFile && <ProcessingState fileName={uploadedFile.name} />}
      {stage === "editor" && uploadedFile && <EditorDashboard file={uploadedFile} onBack={handleBackToUpload} />}
    </main>
  )
}
