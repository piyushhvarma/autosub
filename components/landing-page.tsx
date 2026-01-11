"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, Sparkles, Zap, Clock, FileVideo } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPageProps {
  onFileUpload: (file: File) => void
}

export function LandingPage({ onFileUpload }: LandingPageProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file)
    }
  }, [])

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen flex flex-col noise-bg">
      {/* Ambient glow layer */}
      <div className="fixed inset-0 glow-bg pointer-events-none" />

      <header className="relative z-50 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">SubtitleAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <Button variant="outline" size="sm" className="ghost-btn text-foreground bg-transparent">
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-primary text-xs uppercase tracking-widest mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-medium">Powered by Advanced AI</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground mb-6 text-balance">
            AI Subtitles in{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Seconds</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto text-pretty leading-relaxed">
            Upload your video and let our cutting-edge AI generate accurate, perfectly-timed subtitles. Edit, customize,
            and export in any format.
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto relative">
          <div className="absolute inset-0 glow-center rounded-2xl" />
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative glass-card rounded-2xl p-8 md:p-12 transition-all duration-300 cursor-pointer
              ${isDragging ? "scale-[1.02] border-primary/40 shadow-lg shadow-primary/10" : ""}
              ${selectedFile ? "border-primary/30" : ""}
            `}
          >
            {!selectedFile && (
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            )}

            {selectedFile ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20">
                  <FileVideo className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-base font-medium text-foreground tracking-tight">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button onClick={handleUpload} size="lg" className="mt-2 primary-btn" type="button">
                  <Upload className="w-4 h-4 mr-2" />
                  Start Processing
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                    isDragging ? "bg-primary/20 border-primary/30 scale-110" : "bg-white/[0.03] border-white/[0.06]"
                  }`}
                >
                  <Upload
                    className={`w-8 h-8 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-base font-medium text-foreground tracking-tight">
                    {isDragging ? "Drop your video here" : "Drag & drop your video"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">
                    or click to browse — MP4, MOV, AVI up to 2GB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-16 relative z-10">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Generate subtitles in under a minute" },
            { icon: Sparkles, title: "99% Accuracy", desc: "State-of-the-art speech recognition" },
            { icon: Clock, title: "Perfect Timing", desc: "Auto-sync with video timeline" },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-4 rounded-xl glass-card spring-hover cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground tracking-tight">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
