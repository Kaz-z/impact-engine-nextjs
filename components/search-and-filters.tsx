"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export interface SearchFilters {
  query: string
  year: string
  category: string
  country: string
  islamicOnly: boolean
  rating: string
}

interface SearchAndFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void
  availableCategories: string[]
  availableCountries: string[]
  availableYears: number[]
}

export function SearchAndFilters({
  onFiltersChange,
  availableCategories,
  availableCountries,
  availableYears,
}: SearchAndFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    year: "",
    category: "",
    country: "",
    islamicOnly: false,
    rating: "",
  })

  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: string | boolean) => {
      const newFilters = { ...filters, [key]: value }
      setFilters(newFilters)
      onFiltersChange(newFilters)
    },
    [filters, onFiltersChange],
  )

  const handleClearFilters = () => {
    const emptyFilters: SearchFilters = {
      query: "",
      year: "",
      category: "",
      country: "",
      islamicOnly: false,
      rating: "",
    }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const hasActiveFilters =
    filters.query || filters.year || filters.category || filters.country || filters.islamicOnly || filters.rating

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-6 shadow-sm">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Input
            placeholder="Search by charity name or registration number..."
            value={filters.query}
            onChange={(e) => handleFilterChange("query", e.target.value)}
            className="pl-10 h-10"
            aria-label="Search charities"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={filters.year} onValueChange={(value) => handleFilterChange("year", value)}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-years">All Years</SelectItem>
              {availableYears
                .sort((a, b) => b - a)
                .map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-countries">All Countries</SelectItem>
              {availableCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-ratings">All Ratings</SelectItem>
              <SelectItem value="Green">Green</SelectItem>
              <SelectItem value="Amber">Amber</SelectItem>
              <SelectItem value="Red">Red</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 pl-3">
            <Checkbox
              id="islamic-only"
              checked={filters.islamicOnly}
              onCheckedChange={(checked) => handleFilterChange("islamicOnly", checked === true)}
              aria-label="Islamic charities only"
            />
            <Label htmlFor="islamic-only" className="cursor-pointer text-sm font-normal">
              Islamic Only
            </Label>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1">
              <span className="text-lg leading-none">×</span>
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
