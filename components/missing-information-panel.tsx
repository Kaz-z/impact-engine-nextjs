import type { Charity, InformationStatus } from "@/lib/types"
import {
  REQUIRED_INFORMATION,
  type InformationCategory,
} from "@/lib/required-information"
import { summarizeInformationStatus } from "@/lib/evaluate-requirements"
import { cn } from "@/lib/utils"

interface MissingInformationPanelProps {
  charity: Charity
}

const CATEGORY_ORDER: InformationCategory[] = [
  "Financial",
  "Governance",
  "Compliance",
  "Reporting",
]

function StatusChip({ status }: { status: InformationStatus }) {
  const styles = {
    present: "bg-emerald-50 text-emerald-700 border-emerald-200",
    missing: "bg-red-50 text-red-700 border-red-200",
    outdated: "bg-amber-50 text-amber-700 border-amber-200",
  }
  const labels = {
    present: "Present",
    missing: "Missing",
    outdated: "Outdated",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  )
}

export function MissingInformationPanel({ charity }: MissingInformationPanelProps) {
  const summary = summarizeInformationStatus(charity)
  const statusById = Object.fromEntries(charity.informationStatus.map((i) => [i.itemId, i]))

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: REQUIRED_INFORMATION.filter((item) => item.category === category).map((item) => ({
      ...item,
      status: statusById[item.id],
    })),
  }))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Required information</h2>
        <p className="text-sm text-gray-500 mb-4">
          Documents and data needed for due diligence. Focus requests on gaps only.
        </p>

        <div className="flex flex-wrap gap-3">
          {summary.isComplete ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Complete — all information on file
            </span>
          ) : (
            <>
              {summary.missingCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                  {summary.missingCount} missing
                </span>
              )}
              {summary.outdatedCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  {summary.outdatedCount} outdated
                </span>
              )}
              {summary.presentCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200">
                  {summary.presentCount} present
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {grouped.map(({ category, items }) => (
        <div key={category} className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
            {category}
          </h3>
          <div className="divide-y divide-gray-100">
            {items.map(({ id, label, status }) => (
              <div key={id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{label}</p>
                  {status?.notes && (
                    <p className="text-sm text-gray-500 mt-1">{status.notes}</p>
                  )}
                  {status?.status === "present" && status.lastUpdated && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last updated{" "}
                      {new Date(status.lastUpdated).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  {status?.status === "present" &&
                    status.notes?.includes("Provided via Impact Engine") && (
                      <p className="text-xs text-blue-600 mt-1 font-medium">
                        Provided via Impact Engine
                      </p>
                    )}
                </div>
                <StatusChip status={status?.status ?? "missing"} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
