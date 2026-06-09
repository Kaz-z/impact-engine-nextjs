"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FunderHeader } from "@/components/funder-header"
import { FundCriteriaConfigurator } from "@/components/fund-criteria-configurator"
import { Button } from "@/components/ui/button"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import {
  loadFundCriteria,
  saveFundCriteria,
  DEFAULT_FUND_CRITERIA,
  type FundCriteriaConfig,
} from "@/lib/fund-preferences"
import { CheckCircle2, Settings } from "lucide-react"

export default function FundSettingsPage() {
  const [config, setConfig] = useState<FundCriteriaConfig>(DEFAULT_FUND_CRITERIA)
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setConfig(loadFundCriteria())
    setHydrated(true)
  }, [])

  function handleSave() {
    saveFundCriteria(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!hydrated) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <FunderHeader />

      <div className="max-w-3xl mx-auto p-6">
        <Link href="/fund">
          <Button variant="ghost" className="gap-2 mb-6">
            ← Back to your fund page
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-gray-400" />
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Fund settings
            </p>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Due diligence criteria
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Configure what {DEMO_FUNDER.name} requires from charities. Enable criteria
            and set your thresholds — these drive filtering on your fund page.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <FundCriteriaConfigurator config={config} onChange={setConfig} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            size="lg"
            className="bg-gray-900 hover:bg-gray-800"
            onClick={handleSave}
          >
            Save criteria
          </Button>
          {saved && (
            <span className="flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Criteria saved
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
