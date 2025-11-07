"use client"

import { useState, useMemo } from "react"
import { SearchAndFilters, type SearchFilters } from "@/components/search-and-filters"
import { CharityCard } from "@/components/charity-card"
import { sampleCharityData } from "@/lib/sample-data"

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    year: "",
    category: "",
    country: "",
    islamicOnly: false,
    rating: "",
  })

  const availableCategories = Array.from(new Set(sampleCharityData.charities.flatMap((c) => c.categories))).sort()

  const availableCountries = Array.from(new Set(sampleCharityData.charities.map((c) => c.country))).sort()

  const availableYears = Array.from(new Set(sampleCharityData.charities.flatMap((c) => c.years.map((y) => y.year))))

  const selectedYear = filters.year || availableYears.sort((a, b) => b - a)[0].toString()

  const filteredCharities = useMemo(() => {
    return sampleCharityData.charities.filter((charity) => {
      // Text search
      if (filters.query) {
        const query = filters.query.toLowerCase()
        if (!charity.name.toLowerCase().includes(query) && !charity.registrationNumber.toLowerCase().includes(query)) {
          return false
        }
      }

      // Year filter (check if charity has data for this year)
      if (filters.year && !charity.years.some((y) => y.year.toString() === filters.year)) {
        return false
      }

      // Category filter
      if (filters.category && !charity.categories.includes(filters.category)) {
        return false
      }

      // Country filter
      if (filters.country && charity.country !== filters.country) {
        return false
      }

      // Rating filter
      if (filters.rating) {
        const year = charity.years.find((y) => y.year.toString() === selectedYear)
        if (!year) return false

        const ratings = [
          year.finance.incomeTrendRating,
          year.finance.operatingSurplusDeficitRating,
          year.finance.fundraisingEfficiencyRating,
        ]

        if (filters.rating === "Red" && !ratings.includes("Red")) return false
        if (filters.rating === "Amber" && !ratings.includes("Amber")) return false
        if (filters.rating === "Green" && !ratings.some((r) => r === "Green")) return false
      }

      return true
    })
  }, [filters, selectedYear])

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchAndFilters
        onFiltersChange={setFilters}
        availableCategories={availableCategories}
        availableCountries={availableCountries}
        availableYears={availableYears}
      />

      <div className="max-w-7xl mx-auto p-6">
        {filteredCharities.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No charities found</h2>
            <p className="text-gray-600">Try adjusting your filters to find charities</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharities.map((charity) => (
              <CharityCard key={charity.id} charity={charity} selectedYear={selectedYear} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
