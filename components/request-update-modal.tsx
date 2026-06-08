"use client"

import { useEffect, useState } from "react"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { InformationItemStatus } from "@/lib/types"
import { REQUIRED_INFORMATION_BY_ID } from "@/lib/required-information"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import { getGapItemIds } from "@/lib/demo-storage"

interface RequestUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  informationStatus: InformationItemStatus[]
  onSubmit: (itemIds: string[], message?: string) => void
}

export function RequestUpdateModal({
  isOpen,
  onClose,
  informationStatus,
  onSubmit,
}: RequestUpdateModalProps) {
  const gapIds = getGapItemIds(informationStatus)
  const [selected, setSelected] = useState<string[]>(gapIds)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (isOpen) {
      setSelected(getGapItemIds(informationStatus))
      setMessage("")
    }
  }, [isOpen, informationStatus])

  if (!isOpen) return null

  const toggleItem = (itemId: string) => {
    setSelected((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    )
  }

  const handleSubmit = () => {
    if (selected.length === 0) return
    onSubmit(selected, message.trim() || undefined)
    setMessage("")
    setSelected(gapIds)
    onClose()
  }

  const gapItems = informationStatus.filter(
    (item) => item.status === "missing" || item.status === "outdated",
  )

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Request update</h2>
              <p className="text-sm text-gray-500 mt-1">
                Ask the charity to provide missing or outdated information
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[50vh] space-y-6">
            <div>
              <Label className="text-xs text-gray-500 uppercase tracking-wide">From</Label>
              <p className="text-sm font-medium text-gray-900 mt-1">{DEMO_FUNDER.name}</p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">Items to request</Label>
              {gapItems.map((item) => {
                const label = REQUIRED_INFORMATION_BY_ID[item.itemId]?.label ?? item.itemId
                return (
                  <label
                    key={item.itemId}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox
                      checked={selected.includes(item.itemId)}
                      onCheckedChange={() => toggleItem(item.itemId)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">{item.status}</p>
                      {item.notes && (
                        <p className="text-xs text-gray-400 mt-1">{item.notes}</p>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>

            <div className="space-y-2">
              <Label htmlFor="request-message" className="text-sm font-medium text-gray-900">
                Message to charity (optional)
              </Label>
              <Textarea
                id="request-message"
                placeholder="Please provide the requested documents at your earliest convenience."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selected.length === 0}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Send request
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
