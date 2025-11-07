"use client"

import { Lightbulb, Video, BookOpen, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImprovementModalProps {
  metricName: string
  isOpen: boolean
  onClose: () => void
}

const improvementGuidance: Record<string, {
  tips: string[]
  resources: {
    type: "training" | "video" | "guide" | "product"
    title: string
    description: string
    link: string
    price?: string
  }[]
}> = {
  "Income Trend": {
    tips: [
      "Diversify your income streams to reduce dependency on single sources",
      "Develop a robust fundraising strategy with both short and long-term goals",
      "Build stronger relationships with existing donors for recurring support"
    ],
    resources: [
      {
        type: "training",
        title: "Sustainable Fundraising Masterclass",
        description: "Learn proven strategies to stabilize and grow your charity's income",
        link: "#",
        price: "£299"
      },
      {
        type: "video",
        title: "Diversifying Income Streams",
        description: "Free 20-minute video guide on building multiple revenue sources",
        link: "#"
      }
    ]
  },
  "Operating Surplus": {
    tips: [
      "Review and optimize operational costs without compromising service quality",
      "Create a reserves policy to guide appropriate surplus levels",
      "Ensure surplus is reinvested in charitable activities or saved for sustainability"
    ],
    resources: [
      {
        type: "guide",
        title: "Financial Planning for Charities",
        description: "Comprehensive guide to achieving healthy financial balance",
        link: "#",
        price: "£49"
      },
      {
        type: "training",
        title: "Cost Management Workshop",
        description: "One-day workshop on efficient operations management",
        link: "#",
        price: "£199"
      }
    ]
  },
  "Fundraising Efficiency": {
    tips: [
      "Analyze which fundraising channels deliver the best return on investment",
      "Invest in donor retention strategies as they're more cost-effective than acquisition",
      "Consider digital fundraising methods which often have lower costs"
    ],
    resources: [
      {
        type: "product",
        title: "Fundraising Analytics Platform",
        description: "Track and optimize your fundraising performance in real-time",
        link: "#",
        price: "From £99/mo"
      },
      {
        type: "video",
        title: "Digital Fundraising Essentials",
        description: "Learn cost-effective online fundraising techniques",
        link: "#"
      }
    ]
  },
  "Reserves Coverage": {
    tips: [
      "Develop a reserves policy that balances financial security with impact delivery",
      "Review reserve levels quarterly and adjust based on operational risks",
      "Communicate your reserves policy transparently to donors"
    ],
    resources: [
      {
        type: "guide",
        title: "Reserves Policy Template",
        description: "Ready-to-use policy template with guidance notes",
        link: "#",
        price: "£29"
      }
    ]
  },
  "Charitable Spending": {
    tips: [
      "Review overhead allocations to ensure maximum resources reach beneficiaries",
      "Streamline administrative processes through automation and better systems",
      "Ensure accurate cost allocation between charitable and support activities"
    ],
    resources: [
      {
        type: "training",
        title: "Operational Excellence Course",
        description: "Optimize your operations to maximize charitable impact",
        link: "#",
        price: "£249"
      },
      {
        type: "product",
        title: "Charity Management Software",
        description: "Reduce admin time with integrated charity management tools",
        link: "#",
        price: "From £79/mo"
      }
    ]
  },
  "Number of Trustees": {
    tips: [
      "Recruit trustees with diverse skills to strengthen governance",
      "Use trustee recruitment platforms to find qualified candidates",
      "Ensure your board size enables effective decision-making and oversight"
    ],
    resources: [
      {
        type: "guide",
        title: "Trustee Recruitment Guide",
        description: "Step-by-step guide to finding and onboarding great trustees",
        link: "#",
        price: "£39"
      },
      {
        type: "training",
        title: "Effective Governance Training",
        description: "Build a high-performing board for your charity",
        link: "#",
        price: "£179"
      }
    ]
  },
  "Governance Policies": {
    tips: [
      "Schedule annual policy reviews and assign responsibility",
      "Use templates from trusted sources to update policies efficiently",
      "Document policy review dates and keep a policy register"
    ],
    resources: [
      {
        type: "product",
        title: "Policy Management System",
        description: "Never miss a policy review with automated reminders",
        link: "#",
        price: "£89/year"
      },
      {
        type: "guide",
        title: "Complete Policy Pack",
        description: "All essential policies for charities, ready to customize",
        link: "#",
        price: "£149"
      }
    ]
  }
}

const getIcon = (type: string) => {
  switch (type) {
    case "training": return <BookOpen className="h-4 w-4" />
    case "video": return <Video className="h-4 w-4" />
    case "guide": return <BookOpen className="h-4 w-4" />
    case "product": return <ExternalLink className="h-4 w-4" />
    default: return <ExternalLink className="h-4 w-4" />
  }
}

export function ImprovementModal({ metricName, isOpen, onClose }: ImprovementModalProps) {
  const guidance = improvementGuidance[metricName]
  
  if (!isOpen || !guidance) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">How to Improve</h2>
                <p className="text-sm text-gray-600">{metricName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
            <div className="space-y-6">
              {/* Tips Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Quick Tips
                </h3>
                <ul className="space-y-2.5">
                  {guidance.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Recommended Resources
                </h3>
                <div className="space-y-3">
                  {guidance.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.link}
                      className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1 text-gray-500 group-hover:text-gray-700 transition-colors">
                          {getIcon(resource.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900">{resource.title}</p>
                            {resource.price && (
                              <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full font-medium">
                                {resource.price}
                              </span>
                            )}
                            {!resource.price && (
                              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-semibold">
                                Free
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{resource.description}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 mt-1 transition-colors" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

