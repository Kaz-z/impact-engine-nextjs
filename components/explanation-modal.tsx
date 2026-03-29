"use client"

import { MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface ExplanationModalProps {
  metricName: string
  rating: string
  isOpen: boolean
  onClose: () => void
  initialValue?: string
  onSave?: (explanation: string) => void
}

export function ExplanationModal({ 
  metricName, 
  rating,
  isOpen, 
  onClose,
  initialValue = "",
  onSave
}: ExplanationModalProps) {
  const [explanation, setExplanation] = useState(initialValue)
  
  if (!isOpen) return null

  const handleSave = () => {
    onSave?.(explanation)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                rating === "Red" ? "bg-red-100" : "bg-amber-100"
              }`}>
                <MessageSquare className={`h-5 w-5 ${
                  rating === "Red" ? "text-red-600" : "text-amber-600"
                }`} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Provide Context</h2>
                <p className="text-sm text-gray-600">{metricName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-2">
                  Why is this score {rating.toLowerCase()}?
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Help donors understand the context behind this metric. Your explanation will be visible to potential supporters.
                </p>
                <Textarea
                  id="explanation"
                  placeholder="For example: 'We invested heavily in a new community center this year, which temporarily reduced our reserves but will enable us to serve 3x more beneficiaries going forward...'"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
            <Button
              onClick={onClose}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Explanation
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
