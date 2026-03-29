"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import { ExplanationModal } from "./explanation-modal"

interface ExplanationInputProps {
  metricName: string
  rating: string
  metricKey: string
}

export function ExplanationInput({ metricName, rating, metricKey }: ExplanationInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [explanation, setExplanation] = useState("")

  // Only show for Red and Amber ratings
  if (rating !== "Red" && rating !== "Amber") return null

  const handleSave = (text: string) => {
    setExplanation(text)
    // TODO: Save to backend/database
    console.log(`Saving explanation for ${metricKey}:`, text)
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`mt-3 flex items-center gap-2 text-xs transition-colors font-medium ${
          rating === "Red" 
            ? "text-red-700 hover:text-red-800" 
            : "text-amber-700 hover:text-amber-800"
        }`}
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <span>{explanation ? "Edit explanation" : "Add explanation"}</span>
      </button>

      <ExplanationModal
        metricName={metricName}
        rating={rating}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialValue={explanation}
        onSave={handleSave}
      />
    </>
  )
}
