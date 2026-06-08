"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { sampleCharityData } from "@/lib/sample-data"
import { CharityProfileView } from "@/components/charity-profile-view"

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

  const selectedYear =
    Number.parseInt(yearParam || "") || Math.max(...charity.years.map((y) => y.year))

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

  return (
    <CharityProfileView
      charity={charity}
      yearData={yearData}
      selectedYear={selectedYear}
      slug={slug}
    />
  )
}
