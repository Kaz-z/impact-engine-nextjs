import type { UpdateHistoryEntry } from "@/lib/types"
import { Share2, Clock, User } from "lucide-react"

interface UpdateHistoryProps {
  entries: UpdateHistoryEntry[]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function UpdateHistory({ entries }: UpdateHistoryProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Clock className="h-8 w-8 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No update history yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">
        Update timeline
      </h3>
      <div className="space-y-0">
        {entries.map((entry, index) => (
          <div key={entry.id} className="relative flex gap-4 pb-8 last:pb-0">
            {index < entries.length - 1 && (
              <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-200" />
            )}
            <div className="relative shrink-0 w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">{formatDate(entry.date)}</p>
              <p className="font-medium text-gray-900">{entry.title}</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{entry.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  Requested by:{" "}
                  {entry.requestedBy.isAnonymous
                    ? "A funder (anonymous)"
                    : entry.requestedBy.displayName}
                </span>
                {entry.isShared && (
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                    <Share2 className="h-3 w-3" />
                    Shared on Impact Engine
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
