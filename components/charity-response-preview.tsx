"use client"

import { useState } from "react"
import { Building2, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { UpdateRequest } from "@/lib/types"
import { REQUIRED_INFORMATION_BY_ID } from "@/lib/required-information"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import type { SimulateResponseOptions } from "@/lib/demo-storage"

interface CharityResponsePreviewProps {
  charityName: string
  pendingRequests: UpdateRequest[]
  onSimulateResponse: (requestId: string, options: SimulateResponseOptions) => void
}

export function CharityResponsePreview({
  charityName,
  pendingRequests,
  onSimulateResponse,
}: CharityResponsePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareWithPlatform, setShareWithPlatform] = useState(true)
  const [showFunderName, setShowFunderName] = useState(false)

  const latestPending = pendingRequests[0]
  if (!latestPending) return null

  const pendingItems = latestPending.items.filter((item) => item.status === "requested")

  const handleSimulate = () => {
    onSimulateResponse(latestPending.id, { shareWithPlatform, showFunderName })
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="gap-2">
        <Eye className="h-4 w-4" />
        Preview charity response
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Charity view</h2>
                    <p className="text-sm text-gray-500">{charityName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[50vh]">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-1">Update request from</p>
                  <p className="text-sm text-gray-600">{DEMO_FUNDER.name}</p>
                  {latestPending.message && (
                    <p className="text-sm text-gray-500 mt-2 italic">
                      &ldquo;{latestPending.message}&rdquo;
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 mb-3">Requested items</p>
                  <ul className="space-y-2">
                    {pendingItems.map((item) => (
                      <li
                        key={item.informationItemId}
                        className="text-sm text-gray-700 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {REQUIRED_INFORMATION_BY_ID[item.informationItemId]?.label ??
                          item.informationItemId}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Sharing preferences</p>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={shareWithPlatform}
                      onCheckedChange={(checked) => setShareWithPlatform(checked === true)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm text-gray-900">
                        Add to shared charity profile on Impact Engine
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Other funders can see this information once provided
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={showFunderName}
                      onCheckedChange={(checked) => setShowFunderName(checked === true)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm text-gray-900">
                        Allow other funders to see {DEMO_FUNDER.name}&apos;s name
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Unchecked by default — funder remains anonymous
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 mb-4">
                  Demo: simulates the charity uploading the first requested item and updating the
                  shared profile.
                </p>
                <Button onClick={handleSimulate} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Simulate charity providing document
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
