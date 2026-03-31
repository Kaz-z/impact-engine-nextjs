"use client"

import { MessageSquare, X, AlertCircle } from "lucide-react"
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

const platformExplanations: Record<string, string> = {
  "Income Trend": "This metric is rated Red because the charity has experienced a significant decline in income year-over-year. A negative income trend can indicate challenges with donor retention, fundraising effectiveness, or external economic factors affecting donations.",
  "Operating Surplus": "This metric is rated Red because the charity is running a significant deficit or has an excessive surplus. A deficit means spending exceeds income, which is unsustainable long-term. An excessive surplus may suggest funds are not being used effectively for charitable purposes.",
  "Fundraising Efficiency": "This metric is rated Red because the cost of raising £1 in donations exceeds 35%. This means a large portion of donations is spent on fundraising rather than charitable activities, which may concern donors.",
  "Reserves Coverage": "This metric is rated Red because the charity has insufficient reserves to cover operating expenses. Less than 3 months of reserves leaves the charity vulnerable to unexpected events or income fluctuations.",
  "Charitable Spending": "This metric is rated Red because less than 60% of total spending goes directly to charitable activities. This suggests a high proportion of funds is being spent on administration and support costs rather than the core mission.",
  "Fundraising & Marketing": "This metric is rated Red because more than 35% of income is being spent on fundraising and marketing. This high proportion reduces the amount available for charitable work.",
  "Number of Trustees": "This metric is rated Red because the number of trustees is outside the recommended range of 5-12. Too few trustees can lead to poor oversight and governance risks, while too many can make decision-making slow and ineffective.",
  "Governance Policies": "This metric is rated Red because key governance policies are not up to date. Outdated policies create compliance risks and suggest weak governance oversight.",
  "Annual Returns": "This metric is rated Red because the charity failed to submit annual returns to the regulator on time. Late submission indicates poor administrative processes and governance concerns.",
  "Safeguarding & Data Protection": "This metric is rated Red because safeguarding and data protection policies are inadequate or missing. This creates serious risks to vulnerable people and personal data.",
  "GDPR Compliance": "This metric is rated Red because the charity is not compliant with GDPR data protection regulations. This creates legal risks and may result in penalties.",
  "Health & Safety Compliance": "This metric is rated Red because the charity is not meeting health and safety requirements. This puts staff, volunteers, and beneficiaries at risk.",
  "Zakat Policy Compliance": "This metric is rated Red because the charity is not fully compliant with Zakat principles and Shariah governance requirements. This may concern donors who specifically give Zakat."
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

  const platformExplanation = rating === "Red" ? platformExplanations[metricName] : null

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
                <h2 className="text-xl font-semibold text-gray-900">Score Explanation</h2>
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
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)] space-y-6">
            {/* Platform Explanation (for Red ratings) */}
            {platformExplanation && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-900 mb-2">Why this is rated Red</h3>
                    <p className="text-sm text-red-800 leading-relaxed">
                      {platformExplanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Charity's Explanation Input */}
            <div>
              <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-2">
                {rating === "Red" ? "Add your context" : "Provide additional context"}
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Help donors understand the full story behind this metric. Your explanation will be visible to potential supporters.
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

