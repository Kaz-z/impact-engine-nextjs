import type { Charity } from "@/lib/types"
import { ExternalLink, Mail, Globe } from "lucide-react"

interface CharityDetailsBlockProps {
  charity: Pick<Charity, "country" | "categories" | "website" | "contactEmail" | "isIslamicCharity">
}

export function CharityDetailsBlock({ charity }: CharityDetailsBlockProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Charity details</h2>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide mb-1">Country</dt>
          <dd className="text-sm font-medium text-gray-900">{charity.country}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide mb-1">Activities</dt>
          <dd className="text-sm font-medium text-gray-900">{charity.categories.join(", ")}</dd>
        </div>
        {charity.isIslamicCharity && (
          <div>
            <dt className="text-xs text-gray-500 uppercase tracking-wide mb-1">Charity type</dt>
            <dd className="text-sm font-medium text-gray-900">Islamic charity</dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide mb-1">Website</dt>
          <dd className="text-sm">
            {charity.website ? (
              <a
                href={charity.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Globe className="h-3.5 w-3.5" />
                {charity.website.replace(/^https?:\/\//, "")}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-gray-400">Not provided</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contact email</dt>
          <dd className="text-sm">
            {charity.contactEmail ? (
              <a
                href={`mailto:${charity.contactEmail}`}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Mail className="h-3.5 w-3.5" />
                {charity.contactEmail}
              </a>
            ) : (
              <span className="text-gray-400">Not provided</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  )
}
