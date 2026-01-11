"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Download, Play, Pause, Volume2, VolumeX, ChevronDown, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sparkles } from "lucide-react"
import type { UploadedFile } from "@/app/page"
import { SubtitleBlock } from "@/components/subtitle-block"

interface EditorDashboardProps {
  file: UploadedFile
  onBack: () => void
}

export interface Subtitle {
  id: string
  startTime: number
  endTime: number
  text: string
}

// Sample subtitles for demo
const sampleSubtitles: Subtitle[] = [
  { id: "1", startTime: 0, endTime: 3.5, text: "Welcome to this tutorial on AI-powered subtitle generation." },
  {
    id: "2",
    startTime: 3.5,
    endTime: 7.2,
    text: "Today we'll explore how machine learning can transform your videos.",
  },
  {
    id: "3",
    startTime: 7.2,
    endTime: 11.8,
    text: "First, let's understand the basics of speech recognition technology.",
  },
  { id: "4", startTime: 11.8, endTime: 16.4, text: "Modern AI models can transcribe speech with remarkable accuracy." },
  {
    id: "5",
    startTime: 16.4,
    endTime: 21.0,
    text: "They analyze audio patterns and convert them into text in real-time.",
  },
  { id: "6", startTime: 21.0, endTime: 25.5, text: "The timestamps are automatically synchronized with the audio." },
  { id: "7", startTime: 25.5, endTime: 30.0, text: "You can edit any subtitle by clicking on the text area." },
  { id: "8", startTime: 30.0, endTime: 34.5, text: "Adjust the timing by modifying the start and end times." },
  { id: "9", startTime: 34.5, endTime: 39.0, text: "Once you're satisfied, export your subtitles in SRT format." },
  { id: "10", startTime: 39.0, endTime: 43.5, text: "Or render a new video with burned-in captions." },
]

export function EditorDashboard({ file, onBack }: EditorDashboardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [subtitles, setSubtitles] = useState<Subtitle[]>(sampleSubtitles)
  const [activeSubtitleId, setActiveSubtitleId] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      const active = subtitles.find((sub) => video.currentTime >= sub.startTime && video.currentTime < sub.endTime)
      setActiveSubtitleId(active?.id || null)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [subtitles])

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
      setCurrentTime(time)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
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
      setCurrentTime(startTime)
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

  const currentSubtitle = subtitles.find((sub) => currentTime >= sub.startTime && currentTime < sub.endTime)

  return (
    <div className="min-h-screen flex flex-col noise-bg bg-background">
      <header className="relative z-50 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="ghost-btn rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-medium tracking-tight text-foreground truncate max-w-[200px] md:max-w-none">
                  {file.name}
                </h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {subtitles.length} subtitles generated
                </p>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 primary-btn">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/[0.08]">
              <DropdownMenuItem onClick={handleExportSRT} className="cursor-pointer">
                Download .SRT File
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Export Rendered Video</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Copy to Clipboard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Video Panel */}
        <div className="lg:w-1/2 xl:w-3/5 p-4 lg:p-6 flex flex-col relative">
          <div className="absolute inset-0 glow-center opacity-50 pointer-events-none" />
          <div className="relative glass-card rounded-2xl overflow-hidden flex-1 flex flex-col">
            {/* Video Container */}
            <div className="relative flex-1 bg-black/40 flex items-center justify-center min-h-[300px]">
              <video
                ref={videoRef}
                src={file.url}
                className="max-w-full max-h-full w-auto h-auto"
                onClick={togglePlay}
              />

              {currentSubtitle && (
                <div className="absolute bottom-16 left-4 right-4 text-center">
                  <span className="inline-block px-5 py-2.5 bg-black/70 backdrop-blur-md text-white rounded-lg text-base font-medium border border-white/10 shadow-xl">
                    {currentSubtitle.text}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
              {/* Progress Bar */}
              <div className="mb-3">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30"
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="ghost-btn rounded-lg h-9 w-9">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="ghost-btn rounded-lg h-9 w-9">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <span className="text-xs text-muted-foreground font-mono ml-2">
                    {formatTime(currentTime)} / {formatTime(duration || 0)}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="ghost-btn rounded-lg h-9 w-9">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitle Editor Panel */}
        <div className="lg:w-1/2 xl:w-2/5 border-t lg:border-t-0 lg:border-l border-white/[0.06] bg-gradient-to-r from-white/[0.01] to-transparent flex flex-col">
          <div className="p-4 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <h2 className="font-medium text-foreground tracking-tight">Subtitle Editor</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Click any caption to edit</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[calc(100vh-16rem)]">
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
          </div>
        </div>
      </div>
    </div>
  )
}
