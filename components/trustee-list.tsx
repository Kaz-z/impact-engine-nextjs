import type { Trustee } from "@/lib/types"

interface TrusteeListProps {
  trustees: Trustee[]
}

export function TrusteeList({ trustees }: TrusteeListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Trustees</h2>
      <p className="text-sm text-gray-500 mb-6">Board members responsible for charity oversight</p>

      <div className="divide-y divide-gray-100">
        {trustees.map((trustee) => (
          <div key={trustee.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div>
              <p className="font-medium text-gray-900">{trustee.name}</p>
              {trustee.role && <p className="text-sm text-gray-500">{trustee.role}</p>}
            </div>
            {trustee.appointedDate && (
              <p className="text-sm text-gray-500 shrink-0 ml-4">
                Appointed{" "}
                {new Date(trustee.appointedDate).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
