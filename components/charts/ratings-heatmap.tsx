"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CharityYear } from "@/lib/types"
import { RatingBadge } from "../rating-badge"

interface RatingsHeatmapProps {
  data: CharityYear[]
}

const metricsConfig = [
  { key: "incomeTrendRating", label: "Income Trend" },
  { key: "operatingSurplusDeficitRating", label: "Operating Surplus" },
  { key: "fundraisingEfficiencyRating", label: "Fundraising Efficiency" },
  { key: "reservesCoverageRating", label: "Reserves Coverage" },
  { key: "charitableSpendingEfficiencyRating", label: "Charitable Spending" },
  { key: "fundraisingAndMarketingEfficiencyRating", label: "F&M Efficiency" },
  { key: "numberOfTrusteesRating", label: "Board Size" },
  { key: "governancePoliciesUpToDateRating", label: "Governance Policies" },
]

export function RatingsHeatmap({ data }: RatingsHeatmapProps) {
  const getRatingValue = (year: CharityYear, metricKey: string) => {
    const parts = metricKey.split(".")
    let obj: any = year
    for (const part of parts) {
      obj = obj[part]
    }
    return obj
  }

  return (
    <Card className="border-gray-200 col-span-full">
      <CardHeader>
        <CardTitle className="text-base">Ratings Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header row */}
            <div className="flex gap-2 mb-4">
              <div className="w-32 flex-shrink-0">
                <p className="text-xs font-semibold text-gray-600 py-2">Metric</p>
              </div>
              {data.map((year) => (
                <div key={year.year} className="w-20 flex-shrink-0 text-center">
                  <p className="text-xs font-semibold text-gray-600">{year.year}</p>
                </div>
              ))}
            </div>

            {/* Metric rows */}
            {metricsConfig.map((metric) => (
              <div key={metric.key} className="flex gap-2 mb-3">
                <div className="w-32 flex-shrink-0">
                  <p className="text-xs text-gray-700 py-1">{metric.label}</p>
                </div>
                {data.map((year) => {
                  let value: any
                  if (metric.key.startsWith("finance")) {
                    value = year.finance[metric.key as keyof typeof year.finance]
                  } else if (metric.key.startsWith("charitable") || metric.key.startsWith("fundraising")) {
                    value = year.operationalCosts[metric.key as keyof typeof year.operationalCosts]
                  } else {
                    value = year.governance[metric.key as keyof typeof year.governance]
                  }

                  // Handle different metric key structures
                  if (metric.key === "incomeTrendRating") {
                    value = year.finance.incomeTrendRating
                  } else if (metric.key === "operatingSurplusDeficitRating") {
                    value = year.finance.operatingSurplusDeficitRating
                  } else if (metric.key === "fundraisingEfficiencyRating") {
                    value = year.finance.fundraisingEfficiencyRating
                  } else if (metric.key === "reservesCoverageRating") {
                    value = year.finance.reservesCoverageRating
                  } else if (metric.key === "charitableSpendingEfficiencyRating") {
                    value = year.operationalCosts.charitableSpendingEfficiencyRating
                  } else if (metric.key === "fundraisingAndMarketingEfficiencyRating") {
                    value = year.operationalCosts.fundraisingAndMarketingEfficiencyRating
                  } else if (metric.key === "numberOfTrusteesRating") {
                    value = year.governance.numberOfTrusteesRating
                  } else if (metric.key === "governancePoliciesUpToDateRating") {
                    value = year.governance.governancePoliciesUpToDateRating
                  }

                  return (
                    <div key={year.year} className="w-20 flex-shrink-0 flex justify-center">
                      <RatingBadge rating={value} showLabel={false} size="sm" />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
