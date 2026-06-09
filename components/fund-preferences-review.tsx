import type { PreferenceCheckResult } from "@/lib/fund-preferences"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import { RatingBadge } from "@/components/rating-badge"
import type { Rating } from "@/lib/types"

interface FundPreferencesReviewProps {
  checks: PreferenceCheckResult[]
}

function overallFromChecks(checks: PreferenceCheckResult[]): Rating {
  const rated = checks.filter((c) => c.rating !== "N/A")
  const red = rated.filter((c) => c.rating === "Red").length
  const amber = rated.filter((c) => c.rating === "Amber").length
  if (red > 0) return "Red"
  if (amber > 0) return "Amber"
  return "Green"
}

export function FundPreferencesReview({ checks }: FundPreferencesReviewProps) {
  const greenCount = checks.filter((c) => c.meetsRequirement).length
  const overall = overallFromChecks(checks)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Due diligence against your criteria
            </h2>
            <p className="text-sm text-gray-500">
              Reviewing against{" "}
              <span className="font-medium text-gray-700">{DEMO_FUNDER.name}</span> preferences
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <RatingBadge rating={overall} size="md" />
            <p className="text-xs text-gray-500">
              {greenCount} of {checks.length} requirements met
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {checks.map((check) => (
          <div key={check.criterionId} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{check.label}</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{check.note}</p>
                {!check.hasSubmittedInfo && (
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    Charity has not submitted this information on the platform.
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <RatingBadge rating={check.rating} size="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
