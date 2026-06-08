export type InformationCategory = "Financial" | "Governance" | "Compliance" | "Reporting"

export interface RequiredInformationItem {
  id: string
  label: string
  category: InformationCategory
}

export const REQUIRED_INFORMATION: RequiredInformationItem[] = [
  { id: "accounts-latest", label: "Latest audited accounts", category: "Financial" },
  { id: "bank-details", label: "Verified bank details", category: "Financial" },
  { id: "trustee-register", label: "Current trustee list", category: "Governance" },
  { id: "governance-policies", label: "Governance policies", category: "Governance" },
  { id: "conflict-of-interest", label: "Conflict of interest register", category: "Governance" },
  { id: "safeguarding-policy", label: "Safeguarding policy", category: "Compliance" },
  { id: "gdpr-policy", label: "Data protection / GDPR policy", category: "Compliance" },
  { id: "insurance-certificate", label: "Insurance certificate", category: "Compliance" },
  { id: "annual-report", label: "Most recent annual report", category: "Reporting" },
]

export const REQUIRED_INFORMATION_BY_ID = Object.fromEntries(
  REQUIRED_INFORMATION.map((item) => [item.id, item]),
) as Record<string, RequiredInformationItem>
