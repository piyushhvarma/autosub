"use client"

import { useRef, useEffect } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Subtitle } from "@/components/editor-dashboard"
import { cn } from "@/lib/utils"

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

  // 1. Auto-scroll to active block
  useEffect(() => {
    if (isActive && blockRef.current) {
      blockRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isActive])

  // 2. Auto-resize text area height
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
      onClick={onJumpTo} // Make the whole card clickable to jump
      className={cn(
        "group relative p-4 rounded-xl transition-all duration-300 border cursor-pointer",
        // ✨ THE GLOW UP LOGIC ✨
        isActive
          ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.01]"
          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10"
      )}
    >
      {/* Neon Indicator Line */}
      {isActive && (
        <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full shadow-[0_0_8px_#3b82f6]" />
      )}

      {/* Header: Time Inputs & Play Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Start Time */}
          <div className={cn("px-2 py-1 rounded-md border transition-colors", 
             isActive ? "bg-blue-500/20 border-blue-500/30" : "bg-black/20 border-white/5"
          )}>
            <input
              type="text"
              value={formatTimeInput(subtitle.startTime)}
              onClick={(e) => e.stopPropagation()} // Prevent jumping when clicking input
              onChange={(e) => onTimeChange("startTime", parseTimeInput(e.target.value))}
              className={cn("w-12 bg-transparent text-[10px] font-mono focus:outline-none text-center",
                isActive ? "text-blue-200" : "text-zinc-400"
              )}
            />
          </div>

          <span className="text-zinc-600 text-[10px]">→</span>

          {/* End Time */}
          <div className={cn("px-2 py-1 rounded-md border transition-colors", 
             isActive ? "bg-blue-500/20 border-blue-500/30" : "bg-black/20 border-white/5"
          )}>
            <input
              type="text"
              value={formatTimeInput(subtitle.endTime)}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onTimeChange("endTime", parseTimeInput(e.target.value))}
              className={cn("w-12 bg-transparent text-[10px] font-mono focus:outline-none text-center",
                isActive ? "text-blue-200" : "text-zinc-400"
              )}
            />
          </div>
        </div>

        {/* Play Button (Only visible on hover) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation()
            onJumpTo()
          }}
        >
          <Play className="w-3 h-3 fill-current" />
        </Button>
      </div>

      {/* The Subtitle Text */}
      <textarea
        ref={textareaRef}
        value={subtitle.text}
        onClick={(e) => e.stopPropagation()} // Allow clicking text to edit without re-triggering jump
        onChange={(e) => onTextChange(e.target.value)}
        className={cn(
          "w-full bg-transparent border-none p-0 resize-none text-sm leading-relaxed focus:ring-0 focus:outline-none",
          isActive ? "text-white font-medium drop-shadow-sm" : "text-zinc-400 group-hover:text-zinc-300"
        )}
        rows={1}
        spellCheck={false}
      />
    </div>
  )
}