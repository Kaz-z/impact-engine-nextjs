import type { DueDiligenceSummary } from "@/lib/evaluate-requirements"
import { getRequirementLabel } from "@/lib/evaluate-requirements"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import { RatingBadge } from "@/components/rating-badge"

interface FunderDueDiligencePanelProps {
  summary: DueDiligenceSummary
}

export function FunderDueDiligencePanel({ summary }: FunderDueDiligencePanelProps) {
  const { results, redCount, amberCount, greenCount, overallRating } = summary

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Due diligence review</h2>
            <p className="text-sm text-gray-500">
              Reviewing against:{" "}
              <span className="font-medium text-gray-700">{DEMO_FUNDER.name}</span> requirements
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <RatingBadge rating={overallRating} size="md" />
            <p className="text-xs text-gray-500">
              {greenCount} green · {amberCount} amber · {redCount} red
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {results.map((result) => (
          <div key={result.requirementId} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">
                  {getRequirementLabel(result.requirementId)}
                </p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{result.note}</p>
              </div>
              <div className="shrink-0">
                <RatingBadge rating={result.rating} size="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
