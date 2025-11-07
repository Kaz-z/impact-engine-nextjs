"use client"

import { useState } from "react"
import { Lightbulb } from "lucide-react"
import { ImprovementModal } from "./improvement-modal"

interface ImprovementSuggestionsProps {
  metricName: string
  rating: string
}

export function ImprovementSuggestions({ metricName, rating }: ImprovementSuggestionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Only show for Amber ratings
  if (rating !== "Amber") return null

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-3 flex items-center gap-2 text-xs text-amber-700 hover:text-amber-800 transition-colors font-medium"
      >
        <Lightbulb className="h-3.5 w-3.5" />
        <span>How to improve</span>
      </button>

      <ImprovementModal
        metricName={metricName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

