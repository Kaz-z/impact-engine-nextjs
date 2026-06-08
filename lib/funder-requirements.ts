export interface FunderRequirement {
  id: string
  label: string
  description: string
}

export const DEMO_FUNDER = {
  id: "example-foundation",
  name: "Example Foundation",
} as const

export const FUNDER_REQUIREMENTS: FunderRequirement[] = [
  {
    id: "dd-registered",
    label: "Registered with Charity Commission",
    description: "Charity must be actively registered in England and Wales.",
  },
  {
    id: "dd-accounts-filed",
    label: "Accounts filed on time",
    description: "Latest annual accounts submitted before the regulatory deadline.",
  },
  {
    id: "dd-min-income",
    label: "Minimum annual income threshold",
    description: "Annual income meets the funder's minimum grant threshold (£500k).",
  },
  {
    id: "dd-trustees",
    label: "Adequate trustee board",
    description: "Board size between 5 and 12 trustees for effective oversight.",
  },
  {
    id: "dd-safeguarding",
    label: "Safeguarding policy in place",
    description: "Current safeguarding policy on file and reviewed within 12 months.",
  },
  {
    id: "dd-gdpr",
    label: "GDPR compliance documented",
    description: "Data protection policies and GDPR compliance documented.",
  },
  {
    id: "dd-charitable-spend",
    label: "Charitable spending ≥ 70%",
    description: "At least 70% of expenditure goes to charitable activities.",
  },
  {
    id: "dd-reserves",
    label: "Reserves 3–6 months",
    description: "Operating reserves cover 3 to 6 months of expenditure.",
  },
  {
    id: "dd-fundraising",
    label: "Fundraising cost ≤ 25%",
    description: "Fundraising costs do not exceed 25% of income.",
  },
  {
    id: "dd-conflict",
    label: "Conflict of interest register",
    description: "Up-to-date register of trustee and staff interests.",
  },
  {
    id: "dd-insurance",
    label: "Valid insurance certificate",
    description: "Public liability and employers' liability insurance in place.",
  },
  {
    id: "dd-bank-verified",
    label: "Bank details verified",
    description: "Bank account details independently verified for grant payments.",
  },
]

export const FUNDER_REQUIREMENTS_BY_ID = Object.fromEntries(
  FUNDER_REQUIREMENTS.map((req) => [req.id, req]),
) as Record<string, FunderRequirement>
