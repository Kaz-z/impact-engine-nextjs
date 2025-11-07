import Link from "next/link"
import type { Charity } from "@/lib/types"
import { RatingBadge } from "./rating-badge"
import { Card } from "@/components/ui/card"

interface CharityCardProps {
  charity: Charity
  selectedYear: string
}

export function CharityCard({ charity, selectedYear }: CharityCardProps) {
  const year = charity.years.find((y) => y.year.toString() === selectedYear) || charity.years[charity.years.length - 1]

  const overallRatings = [
    year.finance.incomeTrendRating,
    year.finance.operatingSurplusDeficitRating,
    year.finance.fundraisingEfficiencyRating,
  ].filter((r) => r !== "N/A")

  const hasRed = overallRatings.includes("Red")
  const hasAmber = overallRatings.includes("Amber")
  const overallStatus = hasRed ? "Red" : hasAmber ? "Amber" : "Green"

  return (
    <Link href={`/charity/${charity.slug}?year=${year.year}`}>
      <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full border-gray-200">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate">{charity.name}</h3>
              <p className="text-xs text-gray-500 font-mono mt-1 truncate">{charity.registrationNumber}</p>
            </div>
          </div>

          <div className="space-y-2 py-4 border-y border-gray-200">
            <p className="text-sm font-medium text-gray-700">Overall rating</p>
            <p className="text-xs text-gray-600">Based on all key metrics</p>
            <div className="pt-2">
              <RatingBadge rating={overallStatus} size="sm" />
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-2">
            <p className="text-sm text-blue-600 font-medium hover:underline">View Details →</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
