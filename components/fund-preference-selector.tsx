"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  FUND_PREFERENCES,
  type FundPreference,
} from "@/lib/fund-preferences"

const CATEGORY_ORDER = ["Financial", "Governance", "Compliance", "Operational"] as const

interface FundPreferenceSelectorProps {
  selected: string[]
  onChange: (ids: string[]) => void
}

function groupByCategory(preferences: FundPreference[]) {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: preferences.filter((p) => p.category === category),
  })).filter((g) => g.items.length > 0)
}

export function FundPreferenceSelector({ selected, onChange }: FundPreferenceSelectorProps) {
  const groups = groupByCategory(FUND_PREFERENCES)

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="space-y-6">
      {groups.map(({ category, items }) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {category}
          </h3>
          <div className="space-y-3">
            {items.map((pref) => (
              <div
                key={pref.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <Checkbox
                  id={pref.id}
                  checked={selected.includes(pref.id)}
                  onCheckedChange={() => toggle(pref.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={pref.id}
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    {pref.label}
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {pref.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
