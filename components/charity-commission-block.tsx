import type { CharityCommissionData } from "@/lib/types"
import { formatCurrency } from "@/lib/charity-metadata"
import { ExternalLink } from "lucide-react"

interface CharityCommissionBlockProps {
  data: CharityCommissionData
  charityNumber: string
}

function FilingStatusBadge({ status }: { status: CharityCommissionData["filingStatus"] }) {
  const styles = {
    "Filed on time": "bg-emerald-50 text-emerald-700 border-emerald-200",
    Overdue: "bg-red-50 text-red-700 border-red-200",
    "Not yet due": "bg-amber-50 text-amber-700 border-amber-200",
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  )
}

export function CharityCommissionBlock({ data, charityNumber }: CharityCommissionBlockProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Charity Commission data</h2>
          <p className="text-sm text-gray-500 mt-1">Source: Charity Commission register</p>
        </div>
        <a
          href={data.registerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium shrink-0"
        >
          View on Charity Commission
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Charity number</p>
          <p className="text-lg font-semibold text-gray-900 font-mono">{charityNumber}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
          <p className="text-lg font-semibold text-gray-900">{data.status}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Financial year end</p>
          <p className="text-lg font-semibold text-gray-900">{data.financialYearEnd}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Latest income</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(data.latestIncome)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Latest expenditure</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(data.latestExpenditure)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Filing status</p>
          <FilingStatusBadge status={data.filingStatus} />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last accounts date</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(data.lastAccountsDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        {data.dateRegistered && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date registered</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(data.dateRegistered).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}
        <div className="sm:col-span-2 lg:col-span-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Registered address</p>
          <p className="text-sm text-gray-900">{data.registeredAddress}</p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Charitable objects</p>
        <p className="text-sm text-gray-700 leading-relaxed">{data.charitableObjects}</p>
      </div>
    </div>
  )
}
