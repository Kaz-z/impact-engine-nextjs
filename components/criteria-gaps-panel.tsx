"use client"

import { useState } from "react"
import { AlertCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PreferenceCheckResult } from "@/lib/fund-preferences"
import type { Charity, InformationItemStatus } from "@/lib/types"
import { REQUIRED_INFORMATION_BY_ID } from "@/lib/required-information"
import { getGapItemIds } from "@/lib/demo-storage"
import { RequestUpdateModal } from "./request-update-modal"
import { RatingBadge } from "./rating-badge"

interface CriteriaGapsPanelProps {
  checks: PreferenceCheckResult[]
  charity: Charity
  onSubmitRequest: (itemIds: string[], message?: string) => void
}

function StatusLabel({ status }: { status: InformationItemStatus["status"] }) {
  const styles = {
    present: "text-emerald-700 bg-emerald-50 border-emerald-200",
    missing: "text-red-700 bg-red-50 border-red-200",
    outdated: "text-amber-700 bg-amber-50 border-amber-200",
  }
  const labels = { present: "Present", missing: "Missing", outdated: "Outdated" }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export function CriteriaGapsPanel({ checks, charity, onSubmitRequest }: CriteriaGapsPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const failedChecks = checks.filter((c) => !c.meetsRequirement)
  const gapItems = charity.informationStatus.filter(
    (i) => i.status === "missing" || i.status === "outdated",
  )
  const gapCount = getGapItemIds(charity.informationStatus).length

  if (failedChecks.length === 0 && gapItems.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
        <p className="text-sm font-medium text-emerald-800">
          This charity meets all your configured requirements.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-amber-50/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Gaps to address</h2>
              <p className="text-sm text-gray-600 mt-1">
                {failedChecks.length > 0 && (
                  <>
                    {failedChecks.length} requirement{failedChecks.length !== 1 ? "s" : ""} not met
                    {gapItems.length > 0 && " · "}
                  </>
                )}
                {gapItems.length > 0 && (
                  <>
                    {gapItems.length} item{gapItems.length !== 1 ? "s" : ""} missing or outdated on
                    profile
                  </>
                )}
              </p>
            </div>
            {gapCount > 0 && (
              <Button
                onClick={() => setModalOpen(true)}
                className="shrink-0 bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Request update
              </Button>
            )}
          </div>
        </div>

        {failedChecks.length > 0 && (
          <div className="divide-y divide-gray-100">
            <p className="px-6 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Unmet requirements
            </p>
            {failedChecks.map((check) => (
              <div key={check.criterionId} className="px-6 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{check.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{check.note}</p>
                </div>
                <RatingBadge rating={check.rating} size="sm" />
              </div>
            ))}
          </div>
        )}

        {gapItems.length > 0 && (
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            <p className="px-6 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Profile information gaps
            </p>
            {gapItems.map((item) => (
              <div key={item.itemId} className="px-6 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {REQUIRED_INFORMATION_BY_ID[item.itemId]?.label ?? item.itemId}
                  </p>
                  {item.notes && <p className="text-sm text-gray-500 mt-1">{item.notes}</p>}
                </div>
                <StatusLabel status={item.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <RequestUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        informationStatus={charity.informationStatus}
        onSubmit={onSubmitRequest}
      />
    </>
  )
}
