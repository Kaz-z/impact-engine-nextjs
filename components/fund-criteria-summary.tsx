import Link from "next/link"
import {
  formatCriterionLabel,
  getEnabledCriterionIds,
  type FundCriteriaConfig,
} from "@/lib/fund-preferences"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, Settings } from "lucide-react"

interface FundCriteriaSummaryProps {
  config: FundCriteriaConfig
}

export function FundCriteriaSummary({ config }: FundCriteriaSummaryProps) {
  const enabledIds = getEnabledCriterionIds(config)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-violet-600 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your due diligence criteria</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {enabledIds.length} requirement{enabledIds.length !== 1 ? "s" : ""} active
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 gap-2" asChild>
          <Link href="/fund/settings">
            <Settings className="h-4 w-4" />
            Configure
          </Link>
        </Button>
      </div>

      {enabledIds.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-3">No criteria configured yet.</p>
          <Button size="sm" asChild>
            <Link href="/fund/settings">Set up criteria</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {enabledIds.map((id) => (
            <li
              key={id}
              className="flex items-center gap-2 text-sm py-2 px-3 rounded-lg bg-gray-50"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
              <span className="text-gray-700">
                {formatCriterionLabel(id, config.values)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
