import { Info } from "lucide-react"
import { UpdateHistory } from "./update-history"
import { CharityResponsePreview } from "./charity-response-preview"
import type { UpdateHistoryEntry, UpdateRequest } from "@/lib/types"
import type { SimulateResponseOptions } from "@/lib/demo-storage"

interface UpdatesTabProps {
  charityName: string
  updateHistory: UpdateHistoryEntry[]
  pendingRequests: UpdateRequest[]
  onSimulateResponse: (requestId: string, options: SimulateResponseOptions) => void
}

export function UpdatesTab({
  charityName,
  updateHistory,
  pendingRequests,
  onSimulateResponse,
}: UpdatesTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900 mb-1">Shared charity profiles</p>
          <p className="text-sm text-blue-800 leading-relaxed">
            When one funder requests an update and the charity responds, that information can be
            added to the shared profile — reducing duplicate requests from other funders.
          </p>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          <CharityResponsePreview
            charityName={charityName}
            pendingRequests={pendingRequests}
            onSimulateResponse={onSimulateResponse}
          />
          <p className="text-sm text-gray-500">
            {pendingRequests.length} pending request{pendingRequests.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <UpdateHistory entries={updateHistory} />
    </div>
  )
}
