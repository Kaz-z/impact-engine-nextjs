import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FunderHeader } from "@/components/funder-header"
import { DEMO_CHARITY_SLUG } from "@/lib/demo-charity"
import {
  ArrowRight,
  Search,
  LayoutDashboard,
  AlertCircle,
  ClipboardCheck,
  Share2,
  Sparkles,
} from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Find a charity",
    description: "Search by name or charity number across the register.",
    tint: "from-pink-50 to-white border-pink-100",
    iconBg: "bg-pink-100 text-pink-600",
  },
  {
    icon: LayoutDashboard,
    title: "One profile",
    description: "Charity Commission data, trustees, and finances together.",
    tint: "from-sky-50 to-white border-sky-100",
    iconBg: "bg-sky-100 text-sky-600",
  },
  {
    icon: ClipboardCheck,
    title: "Due diligence",
    description: "Check requirements with clear red, amber, and green indicators.",
    tint: "from-violet-50 to-white border-violet-100",
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    icon: Share2,
    title: "Shared updates",
    description: "Request missing information once — reuse it across funders.",
    tint: "from-emerald-50 to-white border-emerald-100",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <FunderHeader />

      {/* Hero */}
      <section className="relative overflow-hidden flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-sky-50 to-mint-50 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">
                  For funders
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Review charities faster.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                  One place for Charity Commission data, due diligence checks, and
                  missing information — so you can focus on the gaps.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link href="/search">
                    Search charities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full px-8 border-2 border-gray-200 hover:border-gray-300 bg-white/80"
                  asChild
                >
                  <Link href={`/charity/${DEMO_CHARITY_SLUG}`}>Open demo charity</Link>
                </Button>
              </div>
            </div>

            {/* Profile preview card */}
            <div className="relative lg:pl-4">
              <div className="absolute -top-3 -right-3 w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center shadow-sm">
                <Sparkles className="h-7 w-7 text-yellow-500" />
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Charity profile
                    </p>
                    <p className="text-xl font-bold text-gray-900">Action For Humanity</p>
                    <p className="text-sm text-gray-500 font-mono mt-1">1154881</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      6 items to review
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                      Green
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                      Amber
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Missing information
                    </p>
                    {["Bank details", "Governance policies", "Insurance certificate"].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-gray-50"
                        >
                          <span className="text-gray-700">{item}</span>
                          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                            Missing
                          </span>
                        </div>
                      ),
                    )}
                  </div>

                  <p className="text-xs text-center text-gray-400 pt-2">
                    Search → review → request updates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, tint, iconBg }) => (
              <div
                key={title}
                className={`group bg-gradient-to-br ${tint} rounded-3xl p-6 border-2 hover:-translate-y-0.5 transition-all duration-200`}
              >
                <div
                  className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4 text-gray-400" />
            Pilot demo — not a live platform
          </div>
          <Link
            href="/search"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Go to search →
          </Link>
        </div>
      </footer>
    </div>
  )
}
