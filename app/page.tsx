import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FunderHeader } from "@/components/funder-header"
import { DEMO_FUNDER } from "@/lib/funder-requirements"
import {
  ArrowRight,
  ClipboardCheck,
  Eye,
  Filter,
  Send,
  Sparkles,
} from "lucide-react"

const steps = [
  {
    icon: ClipboardCheck,
    title: "Set requirements",
    description:
      "Configure due diligence criteria — reserves, operating history, safeguarding — with your own thresholds.",
    tint: "from-violet-50 to-white border-violet-100",
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    icon: Eye,
    title: "Choose visibility",
    description:
      "Decide how your funding activity appears — fund name, anonymous, or visible to BMFN network only.",
    tint: "from-sky-50 to-white border-sky-100",
    iconBg: "bg-sky-100 text-sky-600",
  },
  {
    icon: Filter,
    title: "Review charities",
    description:
      "See which charities meet your requirements — and which only partially match.",
    tint: "from-emerald-50 to-white border-emerald-100",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Send,
    title: "Request updates",
    description:
      "Spot gaps on a charity profile and ask them to update missing information.",
    tint: "from-amber-50 to-white border-amber-100",
    iconBg: "bg-amber-100 text-amber-600",
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
                  Impact Engine
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Due diligence, tailored to your fund.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                  Set your requirements, choose how visible you are on the platform, filter
                  charities against your criteria, and request updates where gaps remain.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link href="/fund/settings">
                    Set up your fund
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full px-8 border-2 border-gray-200 hover:border-gray-300 bg-white/80"
                  asChild
                >
                  <Link href="/fund">View charities</Link>
                </Button>
              </div>
            </div>

            <div className="relative lg:pl-4">
              <div className="absolute -top-3 -right-3 w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center shadow-sm">
                <Sparkles className="h-7 w-7 text-yellow-500" />
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {DEMO_FUNDER.name}
                    </p>
                    <p className="text-lg font-bold text-gray-900">Fund settings</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase">Criteria</p>
                    {[
                      "At least 6 months of reserves",
                      "Operating for 5+ years",
                      "Safeguarding policy on file",
                    ].map((item) => (
                      <div
                        key={item}
                        className="text-sm py-1.5 px-3 rounded-lg bg-gray-50 text-gray-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">Visibility</p>
                    <p className="text-sm py-1.5 px-3 rounded-lg bg-gray-50 text-gray-700">
                      Fund name only
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                      Partial match
                    </p>
                    <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-amber-50 border border-amber-100">
                      <span className="font-medium text-gray-900">Action For Humanity</span>
                      <span className="text-xs text-amber-700 font-medium">3 of 4 met</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            href="/fund/settings"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Set up your fund →
          </Link>
        </div>
      </footer>
    </div>
  )
}
