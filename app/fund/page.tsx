"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { FunderHeader } from "@/components/funder-header"
import { FundCriteriaSummary } from "@/components/fund-criteria-summary"
import { FundCharityCard } from "@/components/fund-charity-card"
import { Button } from "@/components/ui/button"
import { sampleCharityData } from "@/lib/sample-data"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import {
  loadFundCriteria,
  filterCharitiesByCriteria,
  getEnabledCriterionIds,
  DEFAULT_FUND_CRITERIA,
  type FundCriteriaConfig,
} from "@/lib/fund-preferences"
import { ClipboardCheck, Filter, Search } from "lucide-react"

export default function FundPage() {
  const [config, setConfig] = useState<FundCriteriaConfig>(DEFAULT_FUND_CRITERIA)
  const [showAll, setShowAll] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setConfig(loadFundCriteria())
    setHydrated(true)

    function onStorage(e: StorageEvent) {
      if (e.key === "impact-engine-fund-criteria") {
        setConfig(loadFundCriteria())
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  // Re-load when navigating back from settings (same tab)
  useEffect(() => {
    if (hydrated && document.visibilityState === "visible") {
      setConfig(loadFundCriteria())
    }
    function onFocus() {
      setConfig(loadFundCriteria())
    }
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [hydrated])

  const enabledCount = getEnabledCriterionIds(config).length

  const results = useMemo(() => {
    return filterCharitiesByCriteria(sampleCharityData.charities, config)
  }, [config])

  const displayed = showAll ? results : results.filter((r) => r.passesAll)
  const matchingCount = results.filter((r) => r.passesAll).length

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
            Charities that have submitted the required information and meet your
            due diligence criteria.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <FundCriteriaSummary config={config} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {matchingCount} {matchingCount === 1 ? "charity meets" : "charities meet"} your criteria
                    </p>
                    <p className="text-sm text-gray-500">
                      {enabledCount} requirement{enabledCount !== 1 ? "s" : ""} active
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={showAll ? "outline" : "default"}
                    size="sm"
                    onClick={() => setShowAll(false)}
                    className={!showAll ? "bg-gray-900 hover:bg-gray-800" : ""}
                  >
                    Matching only
                  </Button>
                  <Button
                    variant={showAll ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowAll(true)}
                    className={showAll ? "bg-gray-900 hover:bg-gray-800" : ""}
                  >
                    Show all
                  </Button>
                </div>
              </div>
            </div>

            {enabledCount === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <ClipboardCheck className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Configure your due diligence criteria
                </h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Set up what your fund requires before filtering charities.
                </p>
                <Button asChild>
                  <Link href="/fund/settings">Configure criteria</Link>
                </Button>
              </div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <Search className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  No charities match all criteria
                </h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Try adjusting your requirements or view all charities to see partial matches.
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => setShowAll(true)}>
                    Show all charities
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/fund/settings">Adjust criteria</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayed.map((result) => (
                  <FundCharityCard key={result.charity.id} result={result} />
                ))}
              </div>
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
