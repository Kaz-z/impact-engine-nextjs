import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FunderHeader } from "@/components/funder-header"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import {
  ArrowRight,
  ClipboardCheck,
  Filter,
  Share2,
  Sparkles,
} from "lucide-react"

const steps = [
  {
    icon: ClipboardCheck,
    title: "Set your criteria",
    description:
      "Choose what due diligence matters to your fund — reserves, operating history, safeguarding, and more.",
    tint: "from-violet-50 to-white border-violet-100",
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    icon: Filter,
    title: "Filter charities",
    description:
      "See only charities that have submitted the required information and meet your standards.",
    tint: "from-sky-50 to-white border-sky-100",
    iconBg: "bg-sky-100 text-sky-600",
  },
  {
    icon: Share2,
    title: "Shared platform data",
    description:
      "See what other funders have already requested — no duplicate asks for the same information.",
    tint: "from-emerald-50 to-white border-emerald-100",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <FunderHeader />

      <section className="relative overflow-hidden flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-sky-50 to-mint-50 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">
                  Your fund page
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Tailor due diligence to your fund.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                  This is where you set your preferences and get a filtered view of charities
                  against your requirements — plus visibility on information other funders have
                  already requested.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link href="/fund">
                    Go to your fund page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Fund page preview */}
            <div className="relative lg:pl-4">
              <div className="absolute -top-3 -right-3 w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center shadow-sm">
                <Sparkles className="h-7 w-7 text-yellow-500" />
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {DEMO_FUNDER.name}
                    </p>
                    <p className="text-lg font-bold text-gray-900">Due diligence criteria</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      "At least 6 months of reserves",
                      "Operating for 5+ years",
                      "Accounts filed on time",
                      "Safeguarding policy on file",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 text-sm py-2 px-3 rounded-lg bg-gray-50"
                      >
                        <span className="w-4 h-4 rounded border-2 border-violet-400 bg-violet-100 flex items-center justify-center">
                          <span className="w-2 h-2 bg-violet-600 rounded-sm" />
                        </span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Matching charities
                    </p>
                    <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-emerald-50 border border-emerald-100">
                      <span className="text-gray-900 font-medium">Action For Humanity</span>
                      <span className="text-xs text-emerald-700 font-medium">3 of 4 met</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-xs text-blue-800">
                      <span className="font-medium">National Relief Trust</span> requested
                      safeguarding policy — you have visibility on this too.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map(({ icon: Icon, title, description, tint, iconBg }) => (
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
          <p className="text-sm text-gray-500">Pilot demo — not a live platform</p>
          <Link
            href="/fund"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Go to your fund page →
          </Link>
        </div>
      </footer>
    </div>
  )
}
