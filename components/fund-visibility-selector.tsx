"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FUND_VISIBILITY_OPTIONS,
  getPublicVisibilityLabel,
  type FundVisibilityConfig,
} from "@/lib/fund-settings"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import { Eye } from "lucide-react"

interface FundVisibilitySelectorProps {
  visibility: FundVisibilityConfig
  onChange: (visibility: FundVisibilityConfig) => void
}

export function FundVisibilitySelector({ visibility, onChange }: FundVisibilitySelectorProps) {
  const previewLabel = getPublicVisibilityLabel(DEMO_FUNDER.name, visibility)

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {FUND_VISIBILITY_OPTIONS.map((option) => (
          <label
            key={option.mode}
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
              visibility.mode === option.mode
                ? "border-violet-200 bg-violet-50/40"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="visibility"
              checked={visibility.mode === option.mode}
              onChange={() => onChange({ ...visibility, mode: option.mode })}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{option.label}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                {option.description}
              </p>
              {option.mode === "name-and-amount" && visibility.mode === "name-and-amount" && (
                <div className="flex items-center gap-2 mt-3" onClick={(e) => e.preventDefault()}>
                  <Label className="text-xs text-gray-500 shrink-0">Grant amount</Label>
                  <Input
                    type="number"
                    min={1000}
                    step={1000}
                    value={visibility.grantAmountGbp}
                    onChange={(e) => {
                      const parsed = Number(e.target.value)
                      if (!Number.isNaN(parsed)) {
                        onChange({ ...visibility, grantAmountGbp: parsed })
                      }
                    }}
                    className="h-8 w-32 text-sm"
                  />
                  <span className="text-xs text-gray-500">GBP</span>
                </div>
              )}
            </div>
          </label>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Eye className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Platform preview
            </p>
            <p className="text-sm text-gray-700">
              Other funders will see your requests as:{" "}
              <span className="font-medium text-gray-900">{previewLabel}</span>
            </p>
            {visibility.mode === "bmfn-network" && (
              <p className="text-xs text-gray-500 mt-2">
                BMFN network members will see:{" "}
                <span className="font-medium">{DEMO_FUNDER.name}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
