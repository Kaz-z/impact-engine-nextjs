"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { FunderHeader } from "@/components/funder-header"
import { FundSettingsSummary } from "@/components/fund-settings-summary"
import { FundCharityCard } from "@/components/fund-charity-card"
import { Button } from "@/components/ui/button"
import { sampleCharityData } from "@/lib/sample-data"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import { DEMO_CHARITY_SLUG } from "@/lib/demo-charity"
import {
  filterCharitiesByCriteria,
  getEnabledCriterionIds,
} from "@/lib/fund-preferences"
import {
  loadFundSettings,
  DEFAULT_FUND_SETTINGS,
  type FundSettings,
} from "@/lib/fund-settings"
import { ClipboardCheck, Filter } from "lucide-react"

export default function FundPage() {
  const [settings, setSettings] = useState<FundSettings>(DEFAULT_FUND_SETTINGS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSettings(loadFundSettings())
    setHydrated(true)

    function refresh() {
      setSettings(loadFundSettings())
    }
    window.addEventListener("focus", refresh)
    return () => window.removeEventListener("focus", refresh)
  }, [])

  const enabledCount = getEnabledCriterionIds(settings.criteria).length

  const results = useMemo(() => {
    return filterCharitiesByCriteria(sampleCharityData.charities, settings.criteria)
  }, [settings.criteria])

  const fullMatches = results.filter((r) => r.passesAll)
  const partialMatches = results.filter((r) => !r.passesAll && r.matchCount > 0)
  const demoCharityResult = partialMatches.find((r) => r.charity.slug === DEMO_CHARITY_SLUG)

  if (!hydrated) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <FunderHeader />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Your fund page
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {DEMO_FUNDER.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            Charities assessed against your due diligence criteria. Review matches
            and partial matches, then open a profile to see gaps and request updates.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <FundSettingsSummary settings={settings} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {enabledCount === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <ClipboardCheck className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Configure your fund settings
                </h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Set due diligence criteria and platform visibility before reviewing charities.
                </p>
                <Button asChild>
                  <Link href="/fund/settings">Set up your fund</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Summary bar */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {fullMatches.length} fully match · {partialMatches.length} partial match
                        {partialMatches.length !== 1 ? "es" : ""}
                      </p>
                      <p className="text-sm text-gray-500">
                        {enabledCount} requirement{enabledCount !== 1 ? "s" : ""} active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Demo charity callout */}
                {demoCharityResult && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                    <p className="text-sm font-medium text-amber-900 mb-1">
                      Demo walkthrough
                    </p>
                    <p className="text-sm text-amber-800 mb-3">
                      <span className="font-medium">{demoCharityResult.charity.name}</span> meets{" "}
                      {demoCharityResult.matchCount} of {demoCharityResult.totalSelected} requirements
                      — open the profile to see what&apos;s missing and request an update.
                    </p>
                    <Button size="sm" className="bg-gray-900 hover:bg-gray-800" asChild>
                      <Link href={`/charity/${DEMO_CHARITY_SLUG}`}>
                        Review {demoCharityResult.charity.name}
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Full matches */}
                {fullMatches.length > 0 && (
                  <section>
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                      Meets all requirements ({fullMatches.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {fullMatches.map((result) => (
                        <FundCharityCard key={result.charity.id} result={result} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Partial matches */}
                {partialMatches.length > 0 && (
                  <section>
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                      Partial matches ({partialMatches.length})
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                      These charities meet some but not all of your criteria — review gaps on their profile.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {partialMatches.map((result) => (
                        <FundCharityCard key={result.charity.id} result={result} />
                      ))}
                    </div>
                  </section>
                )}

                {fullMatches.length === 0 && partialMatches.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      No charities match your criteria
                    </p>
                    <p className="text-gray-600 max-w-md mx-auto mb-4">
                      Try adjusting your requirements in fund settings.
                    </p>
                    <Button variant="outline" asChild>
                      <Link href="/fund/settings">Adjust criteria</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            <p className="text-center text-sm text-gray-500">
              Need to look up a specific charity?{" "}
              <Link href="/search" className="text-blue-600 hover:underline font-medium">
                Search by name or number
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
