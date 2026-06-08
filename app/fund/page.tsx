"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { FunderHeader } from "@/components/funder-header"
import { FundPreferenceSelector } from "@/components/fund-preference-selector"
import { FundCharityCard } from "@/components/fund-charity-card"
import { Button } from "@/components/ui/button"
import { sampleCharityData } from "@/lib/sample-data"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import {
  loadFundPreferences,
  saveFundPreferences,
  filterCharitiesByPreferences,
  DEFAULT_FUND_PREFERENCES,
} from "@/lib/fund-preferences"
import { ClipboardCheck, Filter, Search } from "lucide-react"

export default function FundPage() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_FUND_PREFERENCES)
  const [showAll, setShowAll] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSelected(loadFundPreferences())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      saveFundPreferences(selected)
    }
  }, [selected, hydrated])

  const results = useMemo(() => {
    return filterCharitiesByPreferences(sampleCharityData.charities, selected)
  }, [selected])

  const displayed = showAll ? results : results.filter((r) => r.passesAll)
  const matchingCount = results.filter((r) => r.passesAll).length

  return (
    <div className="min-h-screen bg-gray-50">
      <FunderHeader />

      <div className="max-w-7xl mx-auto p-6">
        {/* Intro */}
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Your fund page
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {DEMO_FUNDER.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            Tailor your due diligence preferences below. We&apos;ll show you charities that
            have submitted the required information and meet your criteria.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preferences panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardCheck className="h-5 w-5 text-violet-600" />
                <h2 className="text-lg font-semibold text-gray-900">Due diligence criteria</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Select what matters to your fund. Results update as you choose.
              </p>
              <FundPreferenceSelector selected={selected} onChange={setSelected} />
            </div>
          </div>

          {/* Results */}
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
                      {selected.length} requirement{selected.length !== 1 ? "s" : ""} selected
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

            {selected.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <ClipboardCheck className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Select your due diligence criteria
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Choose at least one requirement on the left to filter charities against your
                  fund&apos;s standards.
                </p>
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
                <Button variant="outline" onClick={() => setShowAll(true)}>
                  Show all charities
                </Button>
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
