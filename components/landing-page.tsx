"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { AuroraText } from "@/components/ui/aurora-text"
import { CometCard } from "@/components/ui/comet-card"

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
    <AuroraBackground>
      <div className="relative z-10 w-full h-screen flex flex-col overflow-hidden">
        
        {/* --- NAVBAR --- */}
        {/* ✅ UPDATE 1: Increased navbar height to h-32 (128px) to make room */}
        <nav className="flex-none container mx-auto px-6 h-32 flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            {/* ✅ UPDATE 2: Increased logo container to h-28 (112px) */}
            {/* Also increased width to w-80 to allow wider logos to scale up */}
            <div className="relative w-80 h-50"> 
              <Image 
                src="/logo.svg" 
                alt="AutoSub Logo" 
                fill 
                // object-left ensures it stays anchored to the left
                className="object-contain object-left" 
                priority
              />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Button variant="ghost" className="text-white hover:bg-white/10">Sign In</Button>
          </div>
        </nav>

        {/* --- MAIN HERO CONTENT --- */}
        {/* Removed negative margin since nav is taller now */}
        <main className="flex-1 container mx-auto px-6 flex flex-col items-center justify-center text-center">
          
          {/* Hero Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60"
          >
            <span className="font-sans font-bold tracking-tighter block mb-3">
              your videos,
            </span>

            <div className="inline-block relative">
                 <span className="font-serif italic font-medium tracking-tighter px-4 py-1 block">
                   <AuroraText colors={["#FFFFFF", "#E5E7EB", "#D1D5DB", "#F3F4F6"]}>
                     your language.
                   </AuroraText>
                 </span>
            </div>
          </motion.h1>

          <p className="text-lg text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            Stop typing manually. Upload your video and let our AI generate frame-perfect subtitles in seconds.
          </p>

          {/* --- UPLOAD BOX --- */}
          <div className="w-full max-w-xl h-64 relative z-20 mb-10">
             <CometCard className="w-full h-full">
               <div
                 onDragEnter={handleDrag}
                 onDragLeave={handleDrag}
                 onDragOver={handleDrag}
                 onDrop={handleDrop}
                 onClick={() => document.getElementById('file-upload')?.click()}
                 className={`
                   relative h-full w-full 
                   bg-transparent border border-white/10 rounded-2xl p-12
                   flex flex-col items-center justify-center gap-4 text-center
                   transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
                   ${isDragging 
                     ? "border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.3)]" 
                     : "hover:border-white/30"
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
                 <Upload
                  className={`
                    relative z-10 w-10 h-10 transition-all
                    ${isDragging 
                      ? "text-cyan-300 scale-110" 
                      : "text-zinc-400"
                    }
                  `}
                />

                <p className="text-lg font-medium text-white/90">
                  Drop your video here
                </p>

                <p className="text-sm text-zinc-400">
                  MP4, MOV, WebM · Max 25MB
                </p>

               </div>
             </CometCard>
          </div>

        </main>
      </div>
    </AuroraBackground>
  )
}