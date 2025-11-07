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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ImprovementSuggestions } from "@/components/improvement-suggestions"
import { HelpCircle } from "lucide-react"

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
    <TooltipProvider>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <Link href="/search">
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
        <Tabs defaultValue="finance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Finance Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <p className="text-sm text-gray-600">Income Trend (£m)</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Shows year-over-year income growth. Positive numbers indicate growth, negative indicate decline. This matters because consistent income helps charities plan and deliver services reliably.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">{yearData.finance.incomeTrend.toFixed(1)}</span>
                    <RatingBadge rating={yearData.finance.incomeTrendRating} size="sm" />
                  </div>
                  <ImprovementSuggestions metricName="Income Trend" rating={yearData.finance.incomeTrendRating} />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <p className="text-sm text-gray-600">Operating Surplus</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The percentage of income left after expenses. A small surplus (2-5%) is healthy, showing financial sustainability without hoarding funds meant for charitable work.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(yearData.finance.operatingSurplusDeficit * 100).toFixed(1)}%
                    </span>
                    <RatingBadge rating={yearData.finance.operatingSurplusDeficitRating} size="sm" />
                  </div>
                  <ImprovementSuggestions metricName="Operating Surplus" rating={yearData.finance.operatingSurplusDeficitRating} />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <p className="text-sm text-gray-600">Fundraising Efficiency</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cost of raising £1 in donations. Lower is better - it means more of your donation goes to the cause. Under 25% is considered good practice.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(yearData.finance.fundraisingEfficiency * 100).toFixed(0)}%
                    </span>
                    <RatingBadge rating={yearData.finance.fundraisingEfficiencyRating} size="sm" />
                  </div>
                  <ImprovementSuggestions metricName="Fundraising Efficiency" rating={yearData.finance.fundraisingEfficiencyRating} />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <p className="text-sm text-gray-600">Reserves Coverage</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>How many months the charity can operate with existing reserves if income stops. 3-6 months is healthy, providing stability without excessive hoarding.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {yearData.finance.reservesCoverage.toFixed(1)} months
                    </span>
                    <RatingBadge rating={yearData.finance.reservesCoverageRating} size="sm" />
                  </div>
                  <ImprovementSuggestions metricName="Reserves Coverage" rating={yearData.finance.reservesCoverageRating} />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <p className="text-sm text-gray-600">Charitable Spending</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Percentage of total spending that goes directly to charitable activities. Higher is better - it shows more funds reach the cause rather than being spent on operations.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(yearData.operationalCosts.charitableSpendingEfficiency * 100).toFixed(0)}%
                    </span>
                    <RatingBadge rating={yearData.operationalCosts.charitableSpendingEfficiencyRating} size="sm" />
                  </div>
                  <ImprovementSuggestions metricName="Charitable Spending" rating={yearData.operationalCosts.charitableSpendingEfficiencyRating} />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <p className="text-sm text-gray-600">Fundraising & Marketing</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Percentage of income spent on fundraising and marketing activities. Lower is better - under 25% is considered efficient and means more funds go to the actual cause.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(yearData.operationalCosts.fundraisingAndMarketingEfficiency * 100).toFixed(0)}%
                    </span>
                    <RatingBadge rating={yearData.operationalCosts.fundraisingAndMarketingEfficiencyRating} size="sm" />
                  </div>
                  <ImprovementSuggestions metricName="Fundraising Efficiency" rating={yearData.operationalCosts.fundraisingAndMarketingEfficiencyRating} />
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Governance</h2>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="font-medium text-gray-900">Number of Trustees</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The size of the board governing the charity. 5-12 trustees is ideal for effective oversight and decision-making without becoming unwieldy.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-gray-600">Board members responsible for oversight</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-gray-900">{yearData.governance.numberOfTrustees}</span>
                      <RatingBadge rating={yearData.governance.numberOfTrusteesRating} size="sm" />
                    </div>
                  </div>
                  <ImprovementSuggestions metricName="Number of Trustees" rating={yearData.governance.numberOfTrusteesRating} />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="font-medium text-gray-900">Governance Policies</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Whether policies and procedures are current and reviewed regularly. Up-to-date policies ensure the charity operates with proper accountability and transparency.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-gray-600">Policies kept up to date</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{yearData.governance.governancePoliciesUpToDate ? "Yes" : "No"}</span>
                      <RatingBadge rating={yearData.governance.governancePoliciesUpToDateRating} size="sm" />
                    </div>
                  </div>
                  <ImprovementSuggestions metricName="Governance Policies" rating={yearData.governance.governancePoliciesUpToDateRating} />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <p className="font-medium text-gray-900">Annual Returns</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Whether the charity submits required annual returns to regulators on time. Timely submission demonstrates good governance and regulatory compliance.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-gray-600">Submitted on time to regulator</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{yearData.governance.annualReturnsSubmittedOnTime ? "On Time" : "Late"}</span>
                    <RatingBadge rating={yearData.governance.annualReturnsSubmittedOnTimeRating} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Compliance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <p className="font-medium text-gray-900">Safeguarding & Data Protection</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Policies to protect vulnerable people and personal data. Comprehensive policies show the charity takes safety and privacy seriously.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-gray-600">{yearData.compliance.safeguardingAndDataProtectionPolicies}</p>
                  </div>
                  <RatingBadge rating={yearData.compliance.safeguardingAndDataProtectionPoliciesRating} size="sm" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <p className="font-medium text-gray-900">GDPR Compliance</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adherence to data protection regulations. GDPR compliance ensures donor and beneficiary data is handled responsibly and legally.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-gray-600">{yearData.compliance.gdprCompliance}</p>
                  </div>
                  <RatingBadge rating={yearData.compliance.gdprComplianceRating} size="sm" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <p className="font-medium text-gray-900">Health & Safety Compliance</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adherence to health and safety regulations. Proper compliance protects staff, volunteers, and beneficiaries from harm.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-gray-600">{yearData.compliance.healthAndSafetyCompliance}</p>
                  </div>
                  <RatingBadge rating={yearData.compliance.healthAndSafetyComplianceRating} size="sm" />
                </div>

                {yearData.compliance.zakatPolicyCompliance && (
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="font-medium text-gray-900">Zakat Policy Compliance</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>For Islamic charities: adherence to Zakat principles and Shariah governance. Ensures donations are distributed according to Islamic law.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-gray-600">{yearData.compliance.zakatPolicyCompliance}</p>
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
    </TooltipProvider>
  )
}
