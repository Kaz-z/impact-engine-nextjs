"use client"

import { use } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RatingBadge } from "@/components/rating-badge"
import { IncomeTrendChart } from "@/components/charts/income-trend-chart"
import { OperatingSurplusChart } from "@/components/charts/operating-surplus-chart"
import { EfficiencyChart } from "@/components/charts/efficiency-chart"
import { ReservesCoverageChart } from "@/components/charts/reserves-coverage-chart"
import { RatingsHeatmap } from "@/components/charts/ratings-heatmap"
import { sampleCharityData } from "@/lib/sample-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DetailPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ year?: string }>
}

export default function CharityDetailPage({ params, searchParams }: DetailPageProps) {
  const { slug } = use(params)
  const { year: yearParam } = use(searchParams)

  const charity = sampleCharityData.charities.find((c) => c.slug === slug)

  if (!charity) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-6">
              ← Back
            </Button>
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Charity not found</h1>
          </div>
        </div>
      </div>
    )
  }

  const selectedYear = Number.parseInt(yearParam || "") || Math.max(...charity.years.map((y) => y.year))

  const yearData = charity.years.find((y) => y.year === selectedYear)

  if (!yearData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-6">
              ← Back
            </Button>
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Data not available for selected year</h1>
          </div>
        </div>
      </div>
    )
  }

  const allRatings = [
    yearData.finance.incomeTrendRating,
    yearData.finance.operatingSurplusDeficitRating,
    yearData.finance.fundraisingEfficiencyRating,
    yearData.finance.reservesCoverageRating,
    yearData.operationalCosts.charitableSpendingEfficiencyRating,
    yearData.operationalCosts.fundraisingAndMarketingEfficiencyRating,
  ].filter((r) => r !== "N/A")

  const hasRed = allRatings.includes("Red")
  const hasAmber = allRatings.includes("Amber")
  const overallRating = hasRed ? "Red" : hasAmber ? "Amber" : "Green"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-6">
            ← Back to Search
          </Button>
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{charity.name}</h1>
              <p className="text-sm text-gray-500 font-mono">{charity.registrationNumber}</p>
            </div>
            <div className="flex gap-3 flex-wrap justify-end">
              {charity.isIslamicCharity && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  Islamic Charity
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col justify-center">
              <p className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-1">Overall Rating</p>
              <p className="text-sm text-gray-700 mb-4">Based on all key metrics</p>
              <div className="w-fit">
                <RatingBadge rating={overallRating} size="lg" />
              </div>
            </div>
            <div className="border-l-2 border-gray-200 pl-6 flex flex-col justify-center">
              <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Select Year</p>
              <Select
                value={selectedYear.toString()}
                onValueChange={(year) => {
                  const newUrl = `/charity/${slug}?year=${year}`
                  window.location.href = newUrl
                }}
              >
                <SelectTrigger className="w-32 h-10">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {charity.years
                    .map((y) => y.year)
                    .sort((a, b) => b - a)
                    .map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Income Trend</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">{yearData.finance.incomeTrend.toFixed(1)}</span>
                    <RatingBadge rating={yearData.finance.incomeTrendRating} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Operating Surplus</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(yearData.finance.operatingSurplusDeficit * 100).toFixed(1)}%
                    </span>
                    <RatingBadge rating={yearData.finance.operatingSurplusDeficitRating} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Fundraising Efficiency</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(yearData.finance.fundraisingEfficiency * 100).toFixed(0)}%
                    </span>
                    <RatingBadge rating={yearData.finance.fundraisingEfficiencyRating} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Reserves Coverage</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {yearData.finance.reservesCoverage.toFixed(1)} mo
                    </span>
                    <RatingBadge rating={yearData.finance.reservesCoverageRating} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Charitable Spending</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(yearData.operationalCosts.charitableSpendingEfficiency * 100).toFixed(0)}%
                    </span>
                    <RatingBadge rating={yearData.operationalCosts.charitableSpendingEfficiencyRating} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Board Size</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">{yearData.governance.numberOfTrustees}</span>
                    <RatingBadge rating={yearData.governance.numberOfTrusteesRating} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Finance Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Income Trend (£m)</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">{yearData.finance.incomeTrend.toFixed(1)}</span>
                    <RatingBadge rating={yearData.finance.incomeTrendRating} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Operating Surplus</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(yearData.finance.operatingSurplusDeficit * 100).toFixed(1)}%
                    </span>
                    <RatingBadge rating={yearData.finance.operatingSurplusDeficitRating} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Fundraising Efficiency</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(yearData.finance.fundraisingEfficiency * 100).toFixed(0)}%
                    </span>
                    <RatingBadge rating={yearData.finance.fundraisingEfficiencyRating} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Reserves Coverage</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {yearData.finance.reservesCoverage.toFixed(1)} months
                    </span>
                    <RatingBadge rating={yearData.finance.reservesCoverageRating} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Charitable Spending</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(yearData.operationalCosts.charitableSpendingEfficiency * 100).toFixed(0)}%
                    </span>
                    <RatingBadge rating={yearData.operationalCosts.charitableSpendingEfficiencyRating} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Fundraising & Marketing</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(yearData.operationalCosts.fundraisingAndMarketingEfficiency * 100).toFixed(0)}%
                    </span>
                    <RatingBadge rating={yearData.operationalCosts.fundraisingAndMarketingEfficiencyRating} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncomeTrendChart data={charity.years} />
              <OperatingSurplusChart data={charity.years} />
              <EfficiencyChart
                data={charity.years}
                title="Charitable Spending Efficiency"
                dataKey="charitableSpending"
              />
              <EfficiencyChart
                data={charity.years}
                title="Fundraising & Marketing Efficiency"
                dataKey="fundraisingMarketing"
                lowerIsBetter
              />
              <ReservesCoverageChart data={charity.years} />
            </div>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Governance & Compliance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Governance Policies</p>
                    <p className="text-sm text-gray-600">Policies kept up to date</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{yearData.governance.governancePoliciesUpToDate ? "Yes" : "No"}</span>
                    <RatingBadge rating={yearData.governance.governancePoliciesUpToDateRating} size="sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Annual Returns</p>
                    <p className="text-sm text-gray-600">Submitted on time</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{yearData.governance.annualReturnsSubmittedOnTime ? "Yes" : "No"}</span>
                    <RatingBadge rating={yearData.governance.annualReturnsSubmittedOnTimeRating} size="sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">GDPR Compliance</p>
                    <p className="text-sm text-gray-600">{yearData.compliance.gdprCompliance}</p>
                  </div>
                  <RatingBadge rating={yearData.compliance.gdprComplianceRating} size="sm" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Health & Safety</p>
                    <p className="text-sm text-gray-600">{yearData.compliance.healthAndSafetyCompliance}</p>
                  </div>
                  <RatingBadge rating={yearData.compliance.healthAndSafetyComplianceRating} size="sm" />
                </div>

                {charity.isIslamicCharity && (
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Zakat Policy</p>
                      <p className="text-sm text-gray-600">
                        {yearData.compliance.zakatPolicyCompliance || "Not specified"}
                      </p>
                    </div>
                    <RatingBadge rating={yearData.compliance.zakatPolicyComplianceRating} size="sm" />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <RatingsHeatmap data={charity.years} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
