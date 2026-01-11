"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowLeft, Download, Play, Pause, Volume2, VolumeX, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { UploadedFile } from "@/app/page"
import { SubtitleBlock } from "@/components/subtitle-block"

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
  const timeDisplayRef = useRef<HTMLSpanElement>(null) // Ref for text (No re-renders!)
  
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

  // Format time helper (MM:SS)
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

    // 1. Update Blue Slider Bar directly
    if (progressRef.current && duration > 0) {
      const percent = (currTime / duration) * 100
      progressRef.current.style.width = `${percent}%`
    }

    // 2. Update Time Text directly (Bypasses React State -> SUPER SMOOTH)
    if (timeDisplayRef.current) {
      timeDisplayRef.current.innerText = formatTime(currTime)
    }
    
    // 3. Highlight Active Subtitle (This remains in React state, but it's light)
    const active = subtitles.find((sub) => currTime >= sub.startTime && currTime < sub.endTime)
    if (active?.id !== activeSubtitleId) {
      setActiveSubtitleId(active?.id || null)
    }

    // 4. Loop
    if (!video.paused) {
      requestAnimationFrame(updateProgress)
    }
  }, [duration, subtitles, activeSubtitleId])

  // Trigger loop on play
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
      // Manually trigger one update so it doesn't wait for the loop
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

  // Subtitle & Editor Handlers
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

  // Find current subtitle for Overlay
  // Note: We use a simple lookup here during render for the Overlay text only
  const currentOverlaySubtitle = subtitles.find((sub) => {
    const time = videoRef.current?.currentTime || 0
    return time >= sub.startTime && time < sub.endTime
  })

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      
      {/* HEADER */}
      <header className="h-14 flex-none border-b border-white/[0.06] bg-background/60 backdrop-blur-xl z-50">
        <div className="container h-full mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 hover:bg-white/10 rounded-lg">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <h1 className="text-xs font-medium tracking-tight text-foreground truncate max-w-[150px]">
                {file.name}
              </h1>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 gap-2 bg-blue-600 hover:bg-blue-500 text-white border-0 text-xs">
                <Download className="w-3 h-3" />
                <span>Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/[0.08] bg-black/90 backdrop-blur-xl">
              <DropdownMenuItem onClick={handleExportSRT}>Download .SRT File</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT: Video */}
        <div className="flex-1 flex flex-col bg-black/90 overflow-hidden relative">
          <div className="flex-1 min-h-0 flex items-center justify-center p-2 lg:p-4">
            <div className="relative w-full h-full max-h-full flex items-center justify-center">
              <video
                ref={videoRef}
                src={file.url}
                className="max-w-full max-h-full rounded-lg shadow-2xl bg-black object-contain"
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
                playsInline
              />
              {/* Note: Overlay might flicker slightly less if we used state, but for performance we rely on the 60fps loop update to activeSubtitleId */}
              {activeSubtitleId && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4 pointer-events-none z-20">
                  <span className="inline-block px-4 py-2 bg-black/60 backdrop-blur-md text-white rounded-lg text-base font-medium border border-white/10 shadow-xl transition-all">
                     {subtitles.find(s => s.id === activeSubtitleId)?.text}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER CONTROLS */}
          <div className="flex-none px-4 py-3 border-t border-white/[0.08] bg-[#0A0A0A]">
            <div className="max-w-4xl mx-auto space-y-2">
               
               {/* PROGRESS BAR */}
               <div className="relative w-full h-1.5 group cursor-pointer flex items-center">
                  <div className="absolute inset-0 bg-white/10 rounded-full h-1.5" />
                  
                  {/* Visual Blue Bar (Controlled by Ref) */}
                  <div 
                    ref={progressRef}
                    className="absolute h-1.5 left-0 top-0 bg-blue-500 rounded-full pointer-events-none"
                    style={{ width: '0%' }}
                  />
                  
                  {/* Invisible Input (THE FIX: step="0.001") */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step="0.001" 
                    defaultValue="0"
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                   {/* Thumb Hover Effect */}
                   <div className="absolute w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none left-[0%]" />
               </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="hover:bg-white/10 h-8 w-8 rounded-full text-white">
                    {isPlaying ? <Pause className="fill-current w-4 h-4" /> : <Play className="fill-current w-4 h-4 ml-0.5" />}
                  </Button>
                  
                  {/* Time Text (Controlled by Ref) */}
                  <span className="text-xs font-mono text-zinc-400">
                    <span ref={timeDisplayRef} className="text-white">0:00</span> / {formatTime(duration || 0)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                   <Button variant="ghost" size="icon" onClick={toggleMute} className="hover:bg-white/10 h-8 w-8 text-zinc-400 hover:text-white">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: List */}
        <div className="lg:w-[380px] flex flex-col border-l border-white/[0.08] bg-[#000000] h-full overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between flex-none">
            <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Transcript</h2>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">AI Generated</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
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
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  )
}