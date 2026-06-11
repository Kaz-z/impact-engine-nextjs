"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RatingBadge } from "@/components/rating-badge"
import { IncomeTrendChart } from "@/components/charts/income-trend-chart"
import { OperatingSurplusChart } from "@/components/charts/operating-surplus-chart"
import { EfficiencyChart } from "@/components/charts/efficiency-chart"
import { ReservesCoverageChart } from "@/components/charts/reserves-coverage-chart"
import { RatingsHeatmap } from "@/components/charts/ratings-heatmap"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ImprovementSuggestions } from "@/components/improvement-suggestions"
import { ExplanationInput } from "@/components/explanation-input"
import { CharityCommissionBlock } from "@/components/charity-commission-block"
import { TrusteeList } from "@/components/trustee-list"
import { CharityDetailsBlock } from "@/components/charity-details-block"
import { MissingInformationPanel } from "@/components/missing-information-panel"
import { FunderDueDiligencePanel } from "@/components/funder-due-diligence-panel"
import { SharedPlatformData } from "@/components/shared-platform-data"
import { FundCriteriaTable } from "@/components/fund-criteria-table"
import { ProfileSummaryBadges } from "@/components/profile-summary-badges"
import { UpdatesTab } from "@/components/updates-tab"
import { useCharityDemoState } from "@/hooks/use-charity-demo-state"
import { FunderHeader } from "@/components/funder-header"
import {
  checkCharityAgainstCriteria,
  getEnabledCriterionIds,
} from "@/lib/fund-preferences"
import {
  loadFundSettings,
  DEFAULT_FUND_SETTINGS,
  type FundSettings,
} from "@/lib/fund-settings"
import type { Charity, CharityYear } from "@/lib/types"
import { HelpCircle, CheckCircle2 } from "lucide-react"

interface CharityProfileViewProps {
  charity: Charity
  yearData: CharityYear
  selectedYear: number
  slug: string
}

function getReservesCoverageTooltip(charity: Charity): string {
  const base =
    "How many months the charity can operate with existing reserves. 3-6 months is healthy."
  const reservesEntry = charity.updateHistory.find((entry) =>
    entry.title.toLowerCase().includes("reserves coverage"),
  )
  if (!reservesEntry) return base

  const providedDate = new Date(reservesEntry.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return `${base} Provided on ${providedDate} — this figure may be outdated.`
}

export function CharityProfileView({
  charity: baseCharity,
  yearData,
  selectedYear,
  slug,
}: CharityProfileViewProps) {
  const {
    charity,
    informationSummary,
    getDueDiligenceSummary,
    sendUpdateRequest,
    simulateResponse,
    pendingRequests,
    requestSuccess,
  } = useCharityDemoState(baseCharity)

  const dueDiligenceSummary = getDueDiligenceSummary(yearData)
  const [settings, setSettings] = useState<FundSettings>(DEFAULT_FUND_SETTINGS)

  useEffect(() => {
    setSettings(loadFundSettings())
  }, [])

  const preferenceChecks = useMemo(
    () => checkCharityAgainstCriteria(charity, settings.criteria, selectedYear),
    [charity, settings.criteria, selectedYear],
  )

  const demoMode = getEnabledCriterionIds(settings.criteria).length > 0
  const metCount = preferenceChecks.filter((c) => c.meetsRequirement).length

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <FunderHeader />
        <div className="max-w-7xl mx-auto p-6">
          <Link href="/fund">
            <Button variant="ghost" className="gap-2 mb-6">
              ← Back to Discover
            </Button>
          </Link>

          {requestSuccess && (
            <div className="mb-4 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Update request sent. The charity will be notified to provide the requested information.
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{charity.name}</h1>
                <p className="text-sm text-gray-500">
                  Charity number{" "}
                  <span className="font-mono font-medium text-gray-700">
                    {charity.registrationNumber}
                  </span>
                  {charity.categories[0] && (
                    <span className="text-gray-400 mx-2">·</span>
                  )}
                  {charity.categories[0]}
                </p>
                {demoMode && preferenceChecks.length > 0 && (
                  <p className="text-sm text-gray-600 mt-3">
                    <span className="font-medium text-gray-900">
                      {metCount} of {preferenceChecks.length}
                    </span>{" "}
                    of your fund&apos;s requirements met
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Financial year</p>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(year) => {
                    window.location.href = `/charity/${slug}?year=${year}`
                  }}
                >
                  <SelectTrigger className="w-28 h-9">
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

            {!demoMode && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <ProfileSummaryBadges
                  informationSummary={informationSummary}
                  dueDiligenceSummary={dueDiligenceSummary}
                />
              </div>
            )}
          </div>

          {demoMode ? (
            <div className="space-y-6">
              <FundCriteriaTable
                checks={preferenceChecks}
                charity={charity}
                onSubmitRequest={sendUpdateRequest}
              />
              <SharedPlatformData charity={charity} />
            </div>
          ) : (
            <SharedPlatformData charity={charity} />
          )}

          <Tabs defaultValue="overview" className="space-y-6 mt-6">
            <TabsList
              className={`grid w-full bg-white border border-gray-200 ${
                demoMode ? "grid-cols-3" : "grid-cols-5"
              }`}
            >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {!demoMode && (
                <>
                  <TabsTrigger value="due-diligence">Due diligence</TabsTrigger>
                  <TabsTrigger value="missing-info">Missing info</TabsTrigger>
                </>
              )}
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            {!demoMode && (
              <TabsContent value="due-diligence" className="space-y-6">
                <FunderDueDiligencePanel summary={dueDiligenceSummary} />
              </TabsContent>
            )}

            <TabsContent value="overview" className="space-y-6">
              <CharityCommissionBlock
                data={charity.charityCommission}
                charityNumber={charity.registrationNumber}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrusteeList trustees={charity.trustees} />
                <CharityDetailsBlock charity={charity} />
              </div>
            </TabsContent>

            {!demoMode && (
              <TabsContent value="missing-info">
                <MissingInformationPanel charity={charity} />
              </TabsContent>
            )}

            <TabsContent value="updates">
              <UpdatesTab
                charityName={charity.name}
                updateHistory={charity.updateHistory}
                pendingRequests={pendingRequests}
                onSimulateResponse={simulateResponse}
              />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Tabs defaultValue="finance" className="space-y-6">
                <TabsList className="bg-white border border-gray-200">
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                  <TabsTrigger value="governance">Governance</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="finance" className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Finance Metrics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <FinanceMetric
                        label="Income Trend (£m)"
                        tooltip="Shows year-over-year income growth. Positive numbers indicate growth, negative indicate decline."
                        value={yearData.finance.incomeTrend.toFixed(1)}
                        rating={yearData.finance.incomeTrendRating}
                        metricName="Income Trend"
                        metricKey="incomeTrend"
                      />
                      <FinanceMetric
                        label="Operating Surplus"
                        tooltip="The percentage of income left after expenses. A small surplus (2-5%) is healthy."
                        value={`${(yearData.finance.operatingSurplusDeficit * 100).toFixed(1)}%`}
                        rating={yearData.finance.operatingSurplusDeficitRating}
                        metricName="Operating Surplus"
                        metricKey="operatingSurplus"
                      />
                      <FinanceMetric
                        label="Fundraising Efficiency"
                        tooltip="Cost of raising £1 in donations. Lower is better — under 25% is good practice."
                        value={`${(yearData.finance.fundraisingEfficiency * 100).toFixed(0)}%`}
                        rating={yearData.finance.fundraisingEfficiencyRating}
                        metricName="Fundraising Efficiency"
                        metricKey="fundraisingEfficiency"
                      />
                      <FinanceMetric
                        label="Reserves Coverage"
                        tooltip={getReservesCoverageTooltip(charity)}
                        value={`${yearData.finance.reservesCoverage.toFixed(1)} months`}
                        rating={yearData.finance.reservesCoverageRating}
                        metricName="Reserves Coverage"
                        metricKey="reservesCoverage"
                      />
                      <FinanceMetric
                        label="Charitable Spending"
                        tooltip="Percentage of total spending that goes directly to charitable activities."
                        value={`${(yearData.operationalCosts.charitableSpendingEfficiency * 100).toFixed(0)}%`}
                        rating={yearData.operationalCosts.charitableSpendingEfficiencyRating}
                        metricName="Charitable Spending"
                        metricKey="charitableSpending"
                      />
                      <FinanceMetric
                        label="Fundraising & Marketing"
                        tooltip="Percentage of income spent on fundraising and marketing. Lower is better."
                        value={`${(yearData.operationalCosts.fundraisingAndMarketingEfficiency * 100).toFixed(0)}%`}
                        rating={yearData.operationalCosts.fundraisingAndMarketingEfficiencyRating}
                        metricName="Fundraising & Marketing"
                        metricKey="fundraisingMarketing"
                      />
                    </div>
                  </div>
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

                <TabsContent value="governance" className="space-y-4">
                  <GovernanceSection yearData={yearData} />
                </TabsContent>

                <TabsContent value="compliance" className="space-y-4">
                  <ComplianceSection yearData={yearData} />
                </TabsContent>

                <TabsContent value="history">
                  <RatingsHeatmap data={charity.years} />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  )
}

function FinanceMetric({
  label,
  tooltip,
  value,
  rating,
  metricName,
  metricKey,
}: {
  label: string
  tooltip: string
  value: string
  rating: CharityYear["finance"]["incomeTrendRating"]
  metricName: string
  metricKey: string
}) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        <p className="text-sm text-gray-600">{label}</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <RatingBadge rating={rating} size="sm" />
      </div>
      <ImprovementSuggestions metricName={metricName} rating={rating} />
      <ExplanationInput metricName={metricName} rating={rating} metricKey={metricKey} />
    </div>
  )
}

function GovernanceSection({ yearData }: { yearData: CharityYear }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Governance</h2>
      <div className="space-y-4">
        <GovernanceItem
          title="Number of Trustees"
          tooltip="The size of the board governing the charity. 5-12 trustees is ideal."
          subtitle="Board members responsible for oversight"
          value={yearData.governance.numberOfTrustees.toString()}
          rating={yearData.governance.numberOfTrusteesRating}
          metricName="Number of Trustees"
          metricKey="numberOfTrustees"
        />
        <GovernanceItem
          title="Governance Policies"
          tooltip="Whether policies and procedures are current and reviewed regularly."
          subtitle="Policies kept up to date"
          value={yearData.governance.governancePoliciesUpToDate ? "Yes" : "No"}
          rating={yearData.governance.governancePoliciesUpToDateRating}
          metricName="Governance Policies"
          metricKey="governancePolicies"
        />
        <GovernanceItem
          title="Annual Returns"
          tooltip="Whether the charity submits required annual returns to regulators on time."
          subtitle="Submitted on time to regulator"
          value={yearData.governance.annualReturnsSubmittedOnTime ? "On Time" : "Late"}
          rating={yearData.governance.annualReturnsSubmittedOnTimeRating}
          metricName="Annual Returns"
          metricKey="annualReturns"
        />
      </div>
    </div>
  )
}

function GovernanceItem({
  title,
  tooltip,
  subtitle,
  value,
  rating,
  metricName,
  metricKey,
}: {
  title: string
  tooltip: string
  subtitle: string
  value: string
  rating: CharityYear["finance"]["incomeTrendRating"]
  metricName: string
  metricKey: string
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <p className="font-medium text-gray-900">{title}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">{value}</span>
          <RatingBadge rating={rating} size="sm" />
        </div>
      </div>
      <ImprovementSuggestions metricName={metricName} rating={rating} />
      <ExplanationInput metricName={metricName} rating={rating} metricKey={metricKey} />
    </div>
  )
}

function ComplianceSection({ yearData }: { yearData: CharityYear }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Compliance</h2>
      <div className="space-y-4">
        <ComplianceItem
          title="Safeguarding & Data Protection"
          tooltip="Policies to protect vulnerable people and personal data."
          value={yearData.compliance.safeguardingAndDataProtectionPolicies}
          rating={yearData.compliance.safeguardingAndDataProtectionPoliciesRating}
          metricKey="safeguarding"
        />
        <ComplianceItem
          title="GDPR Compliance"
          tooltip="Adherence to data protection regulations."
          value={yearData.compliance.gdprCompliance}
          rating={yearData.compliance.gdprComplianceRating}
          metricKey="gdprCompliance"
        />
        <ComplianceItem
          title="Health & Safety Compliance"
          tooltip="Adherence to health and safety regulations."
          value={yearData.compliance.healthAndSafetyCompliance}
          rating={yearData.compliance.healthAndSafetyComplianceRating}
          metricKey="healthSafety"
        />
        {yearData.compliance.zakatPolicyCompliance && (
          <ComplianceItem
            title="Zakat Policy Compliance"
            tooltip="For Islamic charities: adherence to Zakat principles and Shariah governance."
            value={yearData.compliance.zakatPolicyCompliance}
            rating={yearData.compliance.zakatPolicyComplianceRating}
            metricKey="zakatCompliance"
          />
        )}
      </div>
    </div>
  )
}

function ComplianceItem({
  title,
  tooltip,
  value,
  rating,
  metricKey,
}: {
  title: string
  tooltip: string
  value: string
  rating: CharityYear["finance"]["incomeTrendRating"]
  metricKey: string
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-1">
          <p className="font-medium text-gray-900">{title}</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-sm text-gray-600">{value}</p>
        <div className="mt-2">
          <RatingBadge rating={rating} size="sm" />
        </div>
        <ExplanationInput metricName={title} rating={rating} metricKey={metricKey} />
      </div>
    </div>
  )
}
