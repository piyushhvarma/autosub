"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Zap, FileVideo } from "lucide-react"
import { Button } from "@/components/ui/button"
// 1. Import the new AuroraText component
import { AuroraText } from "@/components/ui/aurora-text"

interface LandingPageProps {
  onFileUpload: (file: File) => void
}

export function LandingPage({ onFileUpload }: LandingPageProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("video/")) {
        onFileUpload(file)
      } else {
        alert("Please upload a video file (MP4, MOV, WebM)")
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0])
    }
  }

  return (
    // Clean dark background
    <div className="relative min-h-screen bg-[#030303] text-white overflow-hidden selection:bg-blue-500/30">
      
      {/* Subtle Grid Background Overlay for texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="relative z-10">
        
        {/* --- NAVBAR --- */}
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                 <Zap className="w-5 h-5 text-white fill-current" />
              </div>
              <span>AutoSub</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Button variant="ghost" className="text-white hover:bg-white/10">Sign In</Button>
          </div>
        </nav>

        {/* --- MAIN HERO CONTENT --- */}
        <main className="container mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
          
          {/* BADGE REMOVED HERE */}

          {/* Hero Title with AuroraText */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60"
          >
            Your Videos, <br />
            {/* Using AuroraText for the last line. You can change colors prop here if you want different shades. */}
            <AuroraText colors={["#FF0080", "#7928CA", "#0070F3", "#38bdf8"]}>
              Speakin' Hinglish.
            </AuroraText>
          </motion.h1>

          <p className="text-lg text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            Stop typing manually. Upload your video and let our AI generate frame-perfect subtitles in seconds.
          </p>

          {/* --- UPLOAD BOX --- */}
           <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-xl relative group z-20"
            >
               {/* Glow Effect behind box */}
               <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 ${isDragging ? 'opacity-60' : ''}`} />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
                className={`
                  relative bg-[#0A0A0A] border-2 border-dashed rounded-xl p-12
                  flex flex-col items-center justify-center gap-4 text-center
                  transition-all duration-300 ease-in-out cursor-pointer
                  ${isDragging 
                    ? "border-blue-500 bg-blue-500/5 scale-[1.02]" 
                    : "border-white/10 hover:border-white/20 hover:bg-white/5"
                  }
                `}
              >
                 <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleFileSelect}
                />
                 <Upload className={`w-10 h-10 transition-colors ${isDragging ? "text-blue-500 animate-bounce" : "text-zinc-500 group-hover:text-blue-400"}`} />
                 <p className="text-lg font-medium text-white">Drag & drop video here</p>
                 <p className="text-sm text-zinc-500">MP4, MOV, WebM (Max 25MB)</p>
              </div>
           </motion.div>

        </main>
      </div>

    </div>
  )
}