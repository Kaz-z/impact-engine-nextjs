import Link from "next/link"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import { Sparkles } from "lucide-react"

export function FunderHeader() {
  return (
    <header className="sticky top-0 z-50 bg-gray-50/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Impact Engine</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link
              href="/fund/settings"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Criteria
            </Link>
            <Link
              href="/fund"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/search"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Search
            </Link>
          </nav>
        </div>
        <p className="text-xs text-gray-500">
          Logged in as{" "}
          <span className="text-gray-600">{DEMO_FUNDER.name}</span>
        </p>
      </div>
    </header>
  )
}
