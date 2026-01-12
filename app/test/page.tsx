"use client"

import { EditorDashboard } from "@/components/editor-dashboard"

export default function TestEditorPage() {
  
  // 1. Mock Video File (Uses a real public URL so the player works)
  const mockFile = {
    name: "Marketing_Strategy_Q4_Draft.mp4",
    type: "video/mp4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  }

  // 2. Mock Subtitles
  const mockSubtitles = [
    { id: "1", start: 0, end: 4, text: "Hey everyone, welcome back to the channel." },
    { id: "2", start: 4, end: 8.5, text: "Today we are going to discuss the Q4 marketing strategy." },
    { id: "3", start: 8.5, end: 12, text: "But first, make sure to like and subscribe." },
    { id: "4", start: 12, end: 15.5, text: "Let's dive right into the analytics." },
    { id: "5", start: 15.5, end: 20, text: "As you can see, our user retention has grown by 40%." },
    { id: "6", start: 20, end: 25, text: "This is largely due to the new features we shipped last month." },
    { id: "7", start: 25, end: 30, text: "Now, let's look at the areas where we need to improve." },
  ]

  // 3. Render the Dashboard
  return (
    <EditorDashboard 
      file={mockFile} 
      subtitles={mockSubtitles} 
      onBack={() => console.log("Back button clicked in Test Mode")} 
    />
  )
}