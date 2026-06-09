import Link from "next/link"
import type { FilteredCharityResult } from "@/lib/fund-preferences"
import { RatingBadge } from "./rating-badge"
import { Card } from "./ui/card"
import { ArrowRight } from "lucide-react"

interface FundCharityCardProps {
  result: FilteredCharityResult
}

export function FundCharityCard({ result }: FundCharityCardProps) {
  const { charity, checks, matchCount, totalSelected, passesAll } = result
  const latestYear = charity.years.reduce((a, b) => (a.year > b.year ? a : b))

  const overallRating = passesAll ? "Green" : matchCount >= totalSelected / 2 ? "Amber" : "Red"

  return (
    <Link href={`/charity/${charity.slug}?year=${latestYear.year}`}>
      <Card
        className={`p-6 hover:shadow-md transition-shadow cursor-pointer h-full ${
          passesAll ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200"
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate">{charity.name}</h3>
              <p className="text-xs text-gray-500 font-mono mt-1">{charity.registrationNumber}</p>
              {charity.categories[0] && (
                <p className="text-xs text-gray-600 mt-1 truncate">{charity.categories[0]}</p>
              )}
            </div>
            {passesAll && (
              <span className="shrink-0 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                Meets all
              </span>
            )}
          </div>

          <div className="py-3 border-y border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Your requirements</p>
              <p className="text-sm text-gray-600">
                {matchCount} of {totalSelected} met
              </p>
            </div>
            <RatingBadge rating={overallRating} size="sm" />
          </div>

          {checks.length > 0 && (
            <div className="space-y-1.5">
              {checks.slice(0, 3).map((check) => (
                <div key={check.criterionId} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 truncate pr-2">{check.label}</span>
                  <RatingBadge rating={check.rating} size="sm" />
                </div>
              ))}
              {checks.length > 3 && (
                <p className="text-xs text-gray-400">+{checks.length - 3} more checks</p>
              )}
            </div>
          )}

          <p className="text-sm text-blue-600 font-medium flex items-center gap-1 pt-1">
            Review profile
            <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </div>
      </Card>
    </Link>
  )
}
