"use client"

import { useRef, useEffect } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Subtitle } from "@/components/editor-dashboard"

interface SubtitleBlockProps {
  subtitle: Subtitle
  isActive: boolean
  onTextChange: (text: string) => void
  onTimeChange: (field: "startTime" | "endTime", value: number) => void
  onJumpTo: () => void
}

export function SubtitleBlock({ subtitle, isActive, onTextChange, onTimeChange, onJumpTo }: SubtitleBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && blockRef.current) {
      blockRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isActive])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [subtitle.text])

  const formatTimeInput = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(1)
    return `${mins}:${secs.padStart(4, "0")}`
  }

  const parseTimeInput = (value: string): number => {
    const parts = value.split(":")
    if (parts.length === 2) {
      const mins = Number.parseInt(parts[0]) || 0
      const secs = Number.parseFloat(parts[1]) || 0
      return mins * 60 + secs
    }
    return Number.parseFloat(value) || 0
  }

  return (
    <div
      ref={blockRef}
      className={`
        group relative p-4 rounded-xl transition-all duration-300 cursor-default
        ${
          isActive
            ? "glass-card border-primary/30 shadow-lg shadow-primary/5 scale-[1.01]"
            : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] hover:scale-[1.01] hover:translate-x-1"
        }
      `}
      style={{
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
      )}

      {/* Time Inputs */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={formatTimeInput(subtitle.startTime)}
            onChange={(e) => onTimeChange("startTime", parseTimeInput(e.target.value))}
            className="w-16 px-2 py-1 text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all"
          />
          <span className="text-muted-foreground text-xs">→</span>
          <input
            type="text"
            value={formatTimeInput(subtitle.endTime)}
            onChange={(e) => onTimeChange("endTime", parseTimeInput(e.target.value))}
            className="w-16 px-2 py-1 text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200 ghost-btn rounded-lg"
          onClick={onJumpTo}
        >
          <Play className="w-3 h-3" />
        </Button>
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={subtitle.text}
        onChange={(e) => onTextChange(e.target.value)}
        className={`
          w-full bg-transparent border-0 resize-none text-sm leading-relaxed
          focus:outline-none focus:ring-0 placeholder:text-muted-foreground
          ${isActive ? "text-foreground" : "text-foreground/80"}
        `}
        rows={1}
        placeholder="Enter subtitle text..."
      />
    </div>
  )
}
