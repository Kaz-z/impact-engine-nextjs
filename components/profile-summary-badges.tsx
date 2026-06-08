import type { DueDiligenceSummary, InformationSummary } from "@/lib/evaluate-requirements"
import { RatingBadge } from "@/components/rating-badge"
import { cn } from "@/lib/utils"

interface ProfileSummaryBadgesProps {
  informationSummary: InformationSummary
  dueDiligenceSummary: DueDiligenceSummary
}

export function ProfileSummaryBadges({
  informationSummary,
  dueDiligenceSummary,
}: ProfileSummaryBadgesProps) {
  const gapCount = informationSummary.missingCount + informationSummary.outdatedCount

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
      <div className="flex flex-col justify-center">
        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Information status</p>
        {informationSummary.isComplete ? (
          <span
            className={cn(
              "inline-flex w-fit items-center px-3 py-1.5 rounded-full text-sm font-medium",
              "bg-emerald-50 text-emerald-700 border border-emerald-200",
            )}
          >
            Complete
          </span>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium",
                informationSummary.missingCount > 0
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200",
              )}
            >
              {gapCount} item{gapCount !== 1 ? "s" : ""} to review
            </span>
            {informationSummary.missingCount > 0 && (
              <span className="text-xs text-gray-500">
                {informationSummary.missingCount} missing
                {informationSummary.outdatedCount > 0 &&
                  `, ${informationSummary.outdatedCount} outdated`}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="sm:border-l-2 sm:border-gray-200 sm:pl-6 flex flex-col justify-center">
        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Due diligence</p>
        <div className="flex flex-wrap items-center gap-3">
          <RatingBadge rating={dueDiligenceSummary.overallRating} size="md" />
          <span className="text-xs text-gray-500">
            {dueDiligenceSummary.greenCount} green · {dueDiligenceSummary.amberCount} amber ·{" "}
            {dueDiligenceSummary.redCount} red
          </span>
        </div>
      </div>
    </div>
  )
}
