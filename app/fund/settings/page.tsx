"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FunderHeader } from "@/components/funder-header"
import { FundCriteriaConfigurator } from "@/components/fund-criteria-configurator"
import { FundVisibilitySelector } from "@/components/fund-visibility-selector"
import { Button } from "@/components/ui/button"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import {
  loadFundSettings,
  saveFundSettings,
  DEFAULT_FUND_SETTINGS,
  type FundSettings,
} from "@/lib/fund-settings"
import { CheckCircle2, Eye, Settings } from "lucide-react"

export default function FundSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<FundSettings>(DEFAULT_FUND_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSettings(loadFundSettings())
    setHydrated(true)
  }, [])

  function handleSave() {
    saveFundSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleSaveAndView() {
    saveFundSettings(settings)
    router.push("/fund")
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
            Set up {DEMO_FUNDER.name}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Configure your due diligence requirements and choose how visible your
            activity is on the platform.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Due diligence criteria
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              What charities must meet to appear on your fund page.
            </p>
            <FundCriteriaConfigurator
              config={settings.criteria}
              onChange={(criteria) => setSettings({ ...settings, criteria })}
            />
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Platform visibility</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              How your funding activity appears to other funders on Impact Engine.
            </p>
            <FundVisibilitySelector
              visibility={settings.visibility}
              onChange={(visibility) => setSettings({ ...settings, visibility })}
            />
          </section>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" className="bg-gray-900 hover:bg-gray-800" onClick={handleSaveAndView}>
            Save &amp; view charities
          </Button>
          <Button size="lg" variant="outline" onClick={handleSave}>
            Save settings
          </Button>
          {saved && (
            <span className="flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Settings saved
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
