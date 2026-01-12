"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowLeft, Download, Play, Pause, Volume2, VolumeX, Sparkles, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { UploadedFile } from "@/app/page"
import { SubtitleBlock } from "@/components/subtitle-block"
import Image from "next/image"
// 1. Import Aurora
import { AuroraBackground } from "@/components/ui/aurora-background"

interface EditorDashboardProps {
  file: UploadedFile
  subtitles: any[]
  onBack: () => void
}

export interface Subtitle {
  id: string
  startTime: number
  endTime: number
  text: string
}

export function EditorDashboard({ file, subtitles: initialSubtitles, onBack }: EditorDashboardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const timeDisplayRef = useRef<HTMLSpanElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [activeSubtitleId, setActiveSubtitleId] = useState<string | null>(null)

  // Initialize subtitles
  const [subtitles, setSubtitles] = useState<Subtitle[]>(() => {
    if (initialSubtitles && initialSubtitles.length > 0) {
      return initialSubtitles.map((sub: any, index: number) => ({
        id: index.toString(),
        startTime: sub.start || sub.startTime || 0,
        endTime: sub.end || sub.endTime || 0,
        text: sub.text.trim()
      }))
    }
    return []
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // ⚡ 60FPS ANIMATION LOOP
  const updateProgress = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const currTime = video.currentTime

    // 1. Update Gradient Slider Bar
    if (progressRef.current && duration > 0) {
      const percent = (currTime / duration) * 100
      progressRef.current.style.width = `${percent}%`
    }

    // 2. Update Time Text
    if (timeDisplayRef.current) {
      timeDisplayRef.current.innerText = formatTime(currTime)
    }
    
    // 3. Highlight Active Subtitle
    const active = subtitles.find((sub) => currTime >= sub.startTime && currTime < sub.endTime)
    if (active?.id !== activeSubtitleId) {
      setActiveSubtitleId(active?.id || null)
    }

    // 4. Loop
    if (!video.paused) {
      requestAnimationFrame(updateProgress)
    }
  }, [duration, subtitles, activeSubtitleId])

  useEffect(() => {
    if (isPlaying) {
      requestAnimationFrame(updateProgress)
    }
  }, [isPlaying, updateProgress])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number.parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      // Manually trigger one update
      if (progressRef.current && duration > 0) {
        progressRef.current.style.width = `${(time / duration) * 100}%`
      }
      if (timeDisplayRef.current) {
        timeDisplayRef.current.innerText = formatTime(time)
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSubtitleChange = (id: string, newText: string) => {
    setSubtitles((prev) => prev.map((sub) => (sub.id === id ? { ...sub, text: newText } : sub)))
  }
  const handleTimeChange = (id: string, field: "startTime" | "endTime", value: number) => {
    setSubtitles((prev) => prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub)))
  }
  const jumpToSubtitle = (startTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime
      if (!isPlaying) {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleExportSRT = () => {
    const srtContent = subtitles
      .map((sub, index) => {
        const formatSRTTime = (seconds: number) => {
          const h = Math.floor(seconds / 3600)
          const m = Math.floor((seconds % 3600) / 60)
          const s = Math.floor(seconds % 60)
          const ms = Math.floor((seconds % 1) * 1000)
          return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`
        }
        return `${index + 1}\n${formatSRTTime(sub.startTime)} --> ${formatSRTTime(sub.endTime)}\n${sub.text}\n`
      })
      .join("\n")

    const blob = new Blob([srtContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}.srt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    // 2. Wrap everything in AuroraBackground
    <AuroraBackground>
      {/* 3. Main Container uses relative z-10 to sit ON TOP of aurora */}
      <div className="relative z-10 h-screen flex flex-col bg-transparent text-foreground overflow-hidden font-sans selection:bg-blue-500/30">
        
        {/* HEADER: Made transparent/glassy */}
        <header className="h-16 flex-none border-b border-white/[0.06] bg-black/20 backdrop-blur-xl z-50">
          <div className="container h-full mx-auto px-6 flex items-center justify-between">
            
            {/* Left: Back & Title */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack} 
                className="h-9 w-9 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                   <h1 className="text-sm font-medium text-white truncate max-w-[200px]">
                    {file.name}
                   </h1>
                   <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Editor Mode</p>
                </div>
              </div>
            </div>

            {/* Right: Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-9 px-4 gap-2 bg-white text-black hover:bg-zinc-200 font-medium rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-105">
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-white/[0.08] bg-black/80 backdrop-blur-xl text-zinc-300">
                <DropdownMenuItem onClick={handleExportSRT} className="focus:bg-white/10 focus:text-white cursor-pointer">
                   Download .SRT File
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* BODY LAYOUT */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* LEFT: Video Player Studio */}
          {/* Use bg-black/60 to let SOME aurora through, but keep it dark for video contrast */}
          <div className="flex-1 flex flex-col bg-black/60 backdrop-blur-sm relative z-0">
              
              {/* Viewport Area */}
              <div className="flex-1 min-h-0 flex items-center justify-center p-6 lg:p-10 relative">
                 {/* Inner Glow behind video */}
                 <div className="absolute w-[60%] h-[60%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                 <div className="relative w-full h-full max-h-full flex items-center justify-center shadow-2xl">
                   <video
                     ref={videoRef}
                     src={file.url}
                     className="max-w-full max-h-full rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black object-contain z-10"
                     onLoadedMetadata={handleLoadedMetadata}
                     onPlay={() => setIsPlaying(true)}
                     onPause={() => setIsPlaying(false)}
                     onClick={togglePlay}
                     playsInline
                   />
                   
                   {/* Floating Overlay Subtitle */}
                   {activeSubtitleId && (
                     <div className="absolute bottom-10 left-0 right-0 flex justify-center px-8 pointer-events-none z-30">
                       <span className="inline-block px-6 py-3 bg-black/70 backdrop-blur-md text-white rounded-xl text-lg lg:text-xl font-medium border border-white/10 shadow-2xl transition-all">
                          {subtitles.find(s => s.id === activeSubtitleId)?.text}
                       </span>
                     </div>
                   )}
                 </div>
              </div>

              {/* FOOTER CONTROLS: Glass Panel */}
              <div className="flex-none px-6 py-4 border-t border-white/[0.06] bg-black/40 backdrop-blur-md z-20">
                <div className="max-w-4xl mx-auto space-y-4">
                   
                   {/* PROGRESS BAR */}
                   <div className="relative w-full h-1.5 group cursor-pointer flex items-center">
                      {/* Track */}
                      <div className="absolute inset-0 bg-white/10 rounded-full h-1.5" />
                      
                      {/* Visual Gradient Bar */}
                      <div 
                        ref={progressRef}
                        className="absolute h-1.5 left-0 top-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pointer-events-none shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: '0%' }}
                      />
                      
                      {/* Invisible Input */}
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        step="0.001" 
                        defaultValue="0"
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                      />

                       {/* Thumb Hover Effect */}
                       <div 
                         className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 -ml-2"
                         style={{ 
                            left: progressRef.current?.style.width || '0%' 
                         }} 
                       />
                   </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={togglePlay} 
                         className="h-10 w-10 rounded-full bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all shadow-lg shadow-white/5"
                      >
                        {isPlaying ? <Pause className="fill-current w-4 h-4" /> : <Play className="fill-current w-4 h-4 ml-0.5" />}
                      </Button>
                      
                      <span className="text-xs font-mono text-zinc-500 bg-black/40 px-2 py-1 rounded border border-white/5">
                        <span ref={timeDisplayRef} className="text-zinc-200">0:00</span> 
                        <span className="text-zinc-600 mx-1">/</span> 
                        {formatTime(duration || 0)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                       <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full">
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <div className="w-px h-4 bg-white/10 mx-1" />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full">
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* RIGHT: Subtitle List - Glassier to show more Aurora */}
          <div className="lg:w-[400px] flex flex-col border-l border-white/[0.06] bg-black/40 backdrop-blur-xl h-full overflow-hidden relative z-10">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between flex-none bg-black/10">
              <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Transcript
              </h2>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-medium">
                 AI Generated
              </span>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {subtitles.map((subtitle) => (
                <SubtitleBlock
                  key={subtitle.id}
                  subtitle={subtitle}
                  isActive={subtitle.id === activeSubtitleId}
                  onTextChange={(text) => handleSubtitleChange(subtitle.id, text)}
                  onTimeChange={(field, value) => handleTimeChange(subtitle.id, field, value)}
                  onJumpTo={() => jumpToSubtitle(subtitle.startTime)}
                />
              ))}
              <div className="h-10" />
            </div>
          </div>

        </div>
      </div>
    </AuroraBackground>
  )
}