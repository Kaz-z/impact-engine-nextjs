"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { InformationItemStatus } from "@/lib/types"
import { getGapItemIds } from "@/lib/demo-storage"
import { RequestUpdateModal } from "./request-update-modal"

interface RequestUpdateButtonProps {
  informationStatus: InformationItemStatus[]
  onSubmit: (itemIds: string[], message?: string) => void
  className?: string
}

export function RequestUpdateButton({
  informationStatus,
  onSubmit,
  className,
}: RequestUpdateButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const gapCount = getGapItemIds(informationStatus).length

  if (gapCount === 0) return null

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={className ?? "bg-gray-900 hover:bg-gray-800 text-white"}
      >
        <Send className="h-4 w-4 mr-2" />
        Request update
      </Button>
      <RequestUpdateModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        informationStatus={informationStatus}
        onSubmit={onSubmit}
      />
    </>
  )
}
