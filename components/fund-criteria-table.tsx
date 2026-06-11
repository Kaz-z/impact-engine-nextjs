"use client"

import { useState, useMemo } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RatingBadge } from "@/components/rating-badge"
import { RequestUpdateModal } from "@/components/request-update-modal"
import {
  getCriteriaGapRequestItems,
  type PreferenceCheckResult,
} from "@/lib/fund-preferences"
import type { Charity } from "@/lib/types"
import { DEMO_FUNDER } from "@/lib/funder-requirements"

interface FundCriteriaTableProps {
  checks: PreferenceCheckResult[]
  charity: Charity
  onSubmitRequest: (itemIds: string[], message?: string) => void
}

function MetStatus({ meets }: { meets: boolean }) {
  return meets ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      Met
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
      Gap
    </span>
  )
}

export function FundCriteriaTable({
  checks,
  charity,
  onSubmitRequest,
}: FundCriteriaTableProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const metCount = checks.filter((c) => c.meetsRequirement).length
  const gapCount = checks.filter((c) => !c.meetsRequirement).length

  const criteriaGapItems = useMemo(
    () => getCriteriaGapRequestItems(checks, charity.informationStatus),
    [checks, charity.informationStatus],
  )

  const sorted = [...checks].sort((a, b) => {
    if (a.meetsRequirement === b.meetsRequirement) return 0
    return a.meetsRequirement ? 1 : -1
  })

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Your fund&apos;s criteria
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              How {charity.name} measures against{" "}
              <span className="font-medium text-gray-700">{DEMO_FUNDER.name}</span> requirements
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">
                {metCount} of {checks.length}
              </span>{" "}
              met
              {gapCount > 0 && (
                <span className="text-red-600">
                  {" "}
                  · {gapCount} gap{gapCount !== 1 ? "s" : ""}
                </span>
              )}
            </p>
            {criteriaGapItems.length > 0 && (
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Request update
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left font-medium text-gray-600 px-6 py-3">Requirement</th>
                <th className="text-left font-medium text-gray-600 px-4 py-3 w-24">Status</th>
                <th className="text-left font-medium text-gray-600 px-4 py-3">Finding</th>
                <th className="text-left font-medium text-gray-600 px-6 py-3 w-20">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((check) => (
                <tr
                  key={check.criterionId}
                  className={check.meetsRequirement ? "bg-white" : "bg-red-50/40"}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 align-top">
                    {check.label}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <MetStatus meets={check.meetsRequirement} />
                  </td>
                  <td className="px-4 py-4 text-gray-600 align-top leading-relaxed">
                    {check.note}
                    {!check.hasSubmittedInfo && (
                      <span className="block text-xs text-red-600 font-medium mt-1">
                        Not submitted on platform
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <RatingBadge rating={check.rating} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {gapCount > 0 && criteriaGapItems.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-600">
            {gapCount} requirement{gapCount !== 1 ? "s" : ""} not met. Request updated information
            linked to these gaps using the button above.
          </div>
        )}
      </div>

      <RequestUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        informationStatus={charity.informationStatus}
        items={criteriaGapItems}
        onSubmit={onSubmitRequest}
      />
    </>
  )
}
