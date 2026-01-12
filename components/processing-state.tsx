"use client"

import { useState, useEffect } from "react"
import { Sparkles, Check } from "lucide-react"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { CometCard } from "@/components/ui/comet-card"
import Image from "next/image"

interface ProcessingStateProps {
  fileName: string
}

const processingSteps = [
  { id: 1, label: "Uploading video", duration: 1500 },
  { id: 2, label: "Extracting audio", duration: 2000 },
  { id: 3, label: "AutoSub at work", duration: 3000 },
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
    <AuroraBackground>
      <div className="relative z-10 w-full h-full flex flex-col min-h-screen items-center justify-center p-6">
        
        <div className="max-w-md w-full">
          <CometCard className="w-full">
            <div className="p-6 flex flex-col items-center text-center">
              
              {/* Icon Section */}
              <div className="relative mb-2 w-40 h-40 mx-auto">
   <Image 
     src="/logo.svg" 
     alt="Logo"
     fill
     className="object-contain animate-pulse-slow" 
   />
</div>

              <h2 className="text-2xl font-medium tracking-tight text-white mb-2 animate-pulse">
  {processingSteps[currentStep > 0 ? currentStep - 1 : 0].label}...
</h2>
              
              <p className="text-sm text-zinc-400 mb-8 truncate max-w-[280px] uppercase tracking-widest">
                {fileName}
              </p>

              {/* Progress Bar */}
              <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6 border border-white/5">
                <div
                  className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-xs text-zinc-500 mb-8 uppercase tracking-widest">
                Approx. {timeRemaining} seconds remaining
              </p>

              {/* Steps List */}
              <div className="w-full space-y-3">
                {processingSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`
                      flex items-center gap-4 p-3 rounded-xl transition-all duration-500 border
                      ${currentStep > index 
                        ? "bg-white/5 border-white/10 shadow-sm" 
                        : "border-transparent"
                      }
                      ${currentStep === index + 1 
                        ? "bg-white/[0.08] border-white/20 scale-[1.02]" 
                        : ""
                      }
                      ${currentStep < index + 1 
                        ? "opacity-30" 
                        : ""
                      }
                    `}
                  >
                    {/* Step Icon/Number */}
                    <div
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300
                        ${currentStep > index 
                          ? "bg-white text-black shadow-lg shadow-white/20" 
                          : ""
                        }
                        ${currentStep === index + 1 
                          ? "bg-white/20 text-white border border-white/30" 
                          : ""
                        }
                        ${currentStep < index + 1 
                          ? "bg-white/5 text-zinc-500 border border-white/5" 
                          : ""
                        }
                      `}
                    >
                      {currentStep > index ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{step.id}</span>
                      )}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`
                        text-sm font-medium tracking-tight text-left flex-1
                        ${currentStep >= index + 1 ? "text-white" : "text-zinc-500"}
                      `}
                    >
                      {step.label}
                      {currentStep === index + 1 && "..."}
                    </span>

                    {/* Loading Dots Animation */}
                    {currentStep === index + 1 && (
                      <div className="flex gap-1 pr-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </CometCard>
        </div>
      </div>
    </AuroraBackground>
  )
}