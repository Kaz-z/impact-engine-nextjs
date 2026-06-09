import Link from "next/link"
import {
  formatCriterionLabel,
  getEnabledCriterionIds,
} from "@/lib/fund-preferences"
import {
  getPublicVisibilityLabel,
  getVisibilityModeLabel,
  type FundSettings,
} from "@/lib/fund-settings"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, Eye, Settings } from "lucide-react"

interface FundSettingsSummaryProps {
  settings: FundSettings
}

export function FundSettingsSummary({ settings }: FundSettingsSummaryProps) {
  const enabledIds = getEnabledCriterionIds(settings.criteria)
  const visibilityLabel = getPublicVisibilityLabel(
    DEMO_FUNDER.name,
    settings.visibility,
  )

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-violet-600 shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Due diligence criteria</h2>
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
          <p className="text-sm text-gray-600">No criteria configured yet.</p>
        ) : (
          <ul className="space-y-2">
            {enabledIds.map((id) => (
              <li
                key={id}
                className="flex items-center gap-2 text-sm py-2 px-3 rounded-lg bg-gray-50"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                <span className="text-gray-700">
                  {formatCriterionLabel(id, settings.criteria.values)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="h-5 w-5 text-gray-400 shrink-0" />
          <h2 className="text-sm font-semibold text-gray-900">Platform visibility</h2>
        </div>
        <p className="text-sm text-gray-600">
          {getVisibilityModeLabel(settings.visibility.mode)}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Others see: <span className="font-medium text-gray-700">{visibilityLabel}</span>
        </p>
        {settings.visibility.mode === "bmfn-network" && (
          <p className="text-xs text-gray-500 mt-1">
            BMFN network: <span className="font-medium text-gray-700">{DEMO_FUNDER.name}</span>
          </p>
        )}
      </div>
    </div>
  )
}
