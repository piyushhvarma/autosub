"use client"

import { useState, useEffect } from "react"
import { Sparkles, Check } from "lucide-react"

interface ProcessingStateProps {
  fileName: string
}

const processingSteps = [
  { id: 1, label: "Uploading video", duration: 1500 },
  { id: 2, label: "Extracting audio", duration: 2000 },
  { id: 3, label: "AI transcribing", duration: 3000 },
  { id: 4, label: "Generating timestamps", duration: 1500 },
]

export function ProcessingState({ fileName }: ProcessingStateProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(45)

  useEffect(() => {
    const totalDuration = processingSteps.reduce((acc, step) => acc + step.duration, 0)
    let elapsed = 0

    processingSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1)
      }, elapsed)
      elapsed += step.duration
    })

    const progressInterval = setInterval(
      () => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 1.5
        })
      },
      (totalDuration / 100) * 1.5,
    )

    const timeInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timeInterval)
          return 0
        }
        return prev - 1
      })
    }, 200)

    return () => {
      clearInterval(progressInterval)
      clearInterval(timeInterval)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 noise-bg relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />

      <div className="max-w-md w-full mx-auto text-center relative z-10">
        <div className="relative mb-10">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-b from-primary/30 to-primary/10 flex items-center justify-center animate-pulse-glow border border-primary/20 animate-float">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-medium tracking-tight text-foreground mb-2">Processing Your Video</h2>
        <p className="text-sm text-muted-foreground mb-10 truncate px-4 uppercase tracking-widest">{fileName}</p>

        <div className="relative h-2 glass-card rounded-full overflow-hidden mb-6">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full animate-stripe"
            style={{
              width: `${progress}%`,
              backgroundImage:
                "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <p className="text-xs text-muted-foreground mb-10 uppercase tracking-widest">
          Approx. {timeRemaining} seconds remaining
        </p>

        <div className="space-y-2">
          {processingSteps.map((step, index) => (
            <div
              key={step.id}
              className={`
                flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                ${currentStep > index ? "glass-card border-primary/20" : ""}
                ${currentStep === index + 1 ? "glass-card scale-[1.02]" : ""}
                ${currentStep < index + 1 ? "opacity-40" : ""}
              `}
              style={{
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <div
                className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300
                ${currentStep > index ? "bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20" : ""}
                ${currentStep === index + 1 ? "bg-primary/20 text-primary border border-primary/30" : ""}
                ${currentStep < index + 1 ? "bg-white/[0.04] text-muted-foreground border border-white/[0.08]" : ""}
              `}
              >
                {currentStep > index ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{step.id}</span>
                )}
              </div>
              <span
                className={`
                text-sm font-medium tracking-tight
                ${currentStep >= index + 1 ? "text-foreground" : "text-muted-foreground"}
              `}
              >
                {step.label}
                {currentStep === index + 1 && "..."}
              </span>
              {currentStep === index + 1 && (
                <div className="ml-auto flex gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce shadow-sm shadow-primary/50"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce shadow-sm shadow-primary/50"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce shadow-sm shadow-primary/50"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
