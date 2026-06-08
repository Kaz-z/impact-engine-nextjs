import { Share2, Eye } from "lucide-react"
import type { Charity } from "@/lib/types"
import { REQUIRED_INFORMATION_BY_ID } from "@/lib/required-information"
import { getSharedPlatformEntries } from "@/lib/fund-preferences"

interface SharedPlatformDataProps {
  charity: Charity
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function SharedPlatformData({ charity }: SharedPlatformDataProps) {
  const sharedEntries = getSharedPlatformEntries(charity)

  if (sharedEntries.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
          <Eye className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Shared platform data
          </h2>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            Information submitted by this charity for another funder&apos;s requirements —
            visible to you too.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sharedEntries.map((entry) => {
          const itemLabel = entry.informationItemId
            ? REQUIRED_INFORMATION_BY_ID[entry.informationItemId]?.label
            : null
          const funderName = entry.requestedBy.isAnonymous
            ? "Another funder"
            : entry.requestedBy.displayName

          return (
            <div
              key={entry.id}
              className="bg-white rounded-lg border border-blue-100 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{entry.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium text-blue-700">{funderName}</span>
                    {itemLabel ? ` requested ${itemLabel.toLowerCase()}` : " requested an update"}
                    {" — "}
                    you have visibility on this too.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Provided {formatDate(entry.date)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Share2 className="h-3 w-3" />
                  Shared
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
