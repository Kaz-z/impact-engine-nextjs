import type { Charity, CharityYear, Rating } from "./types"
import { evaluateFunderRequirements, type FunderRequirementResult } from "./evaluate-requirements"
import { FUNDER_REQUIREMENTS_BY_ID } from "./funder-requirements"

export interface FundPreference {
  id: string
  label: string
  description: string
  category: "Financial" | "Governance" | "Compliance" | "Operational"
  /** Maps to funder requirement id when applicable */
  requirementId?: string
  /** Information item that must be submitted for document-based checks */
  informationItemId?: string
}

export const FUND_PREFERENCES: FundPreference[] = [
  {
    id: "pref-reserves-6",
    label: "At least 6 months of reserves",
    description: "Operating reserves cover a minimum of 6 months of expenditure.",
    category: "Financial",
  },
  {
    id: "pref-years-5",
    label: "Operating for 5+ years",
    description: "Registered with the Charity Commission for at least five years.",
    category: "Operational",
  },
  {
    id: "dd-accounts-filed",
    label: "Accounts filed on time",
    description: "Latest annual accounts submitted before the regulatory deadline.",
    category: "Financial",
    requirementId: "dd-accounts-filed",
    informationItemId: "accounts-latest",
  },
  {
    id: "dd-min-income",
    label: "Minimum annual income (£500k)",
    description: "Annual income meets the funder's minimum grant threshold.",
    category: "Financial",
    requirementId: "dd-min-income",
    informationItemId: "accounts-latest",
  },
  {
    id: "dd-reserves",
    label: "Reserves within 3–6 months",
    description: "Healthy reserve levels — not too low, not excessive.",
    category: "Financial",
    requirementId: "dd-reserves",
  },
  {
    id: "dd-charitable-spend",
    label: "Charitable spending ≥ 70%",
    description: "At least 70% of expenditure goes to charitable activities.",
    category: "Financial",
    requirementId: "dd-charitable-spend",
  },
  {
    id: "dd-trustees",
    label: "Adequate trustee board (5–12)",
    description: "Board size within recommended range for effective oversight.",
    category: "Governance",
    requirementId: "dd-trustees",
    informationItemId: "trustee-register",
  },
  {
    id: "dd-safeguarding",
    label: "Safeguarding policy on file",
    description: "Current safeguarding policy submitted and available on platform.",
    category: "Compliance",
    requirementId: "dd-safeguarding",
    informationItemId: "safeguarding-policy",
  },
  {
    id: "dd-gdpr",
    label: "GDPR compliance documented",
    description: "Data protection policies documented and on file.",
    category: "Compliance",
    requirementId: "dd-gdpr",
    informationItemId: "gdpr-policy",
  },
  {
    id: "dd-insurance",
    label: "Valid insurance certificate",
    description: "Public liability and employers' liability insurance in place.",
    category: "Compliance",
    requirementId: "dd-insurance",
    informationItemId: "insurance-certificate",
  },
]

export const FUND_PREFERENCES_BY_ID = Object.fromEntries(
  FUND_PREFERENCES.map((p) => [p.id, p]),
) as Record<string, FundPreference>

export const DEFAULT_FUND_PREFERENCES = [
  "pref-reserves-6",
  "pref-years-5",
  "dd-accounts-filed",
  "dd-safeguarding",
]

const STORAGE_KEY = "impact-engine-fund-preferences"

export function loadFundPreferences(): string[] {
  if (typeof window === "undefined") return DEFAULT_FUND_PREFERENCES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_FUND_PREFERENCES
    const parsed = JSON.parse(raw) as string[]
    return parsed.length > 0 ? parsed : DEFAULT_FUND_PREFERENCES
  } catch {
    return DEFAULT_FUND_PREFERENCES
  }
}

export function saveFundPreferences(preferenceIds: string[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferenceIds))
}

export interface PreferenceCheckResult {
  preferenceId: string
  rating: Rating
  note: string
  meetsRequirement: boolean
  hasSubmittedInfo: boolean
}

function yearsSinceRegistration(charity: Charity): number | null {
  const registered = charity.charityCommission.dateRegistered
  if (!registered) return null
  const ms = Date.now() - new Date(registered).getTime()
  return ms / (365.25 * 24 * 60 * 60 * 1000)
}

function hasSubmittedInfo(charity: Charity, itemId?: string): boolean {
  if (!itemId) return true
  const item = charity.informationStatus.find((i) => i.itemId === itemId)
  return item?.status === "present" || item?.status === "outdated"
}

function evaluatePreference(
  preferenceId: string,
  charity: Charity,
  yearData: CharityYear,
  ddResults: FunderRequirementResult[],
): PreferenceCheckResult {
  const preference = FUND_PREFERENCES_BY_ID[preferenceId]
  if (!preference) {
    return {
      preferenceId,
      rating: "N/A",
      note: "Unknown preference",
      meetsRequirement: false,
      hasSubmittedInfo: false,
    }
  }

  if (preferenceId === "pref-reserves-6") {
    const months = yearData.finance.reservesCoverage
    const meets = months >= 6
    const rating: Rating = meets ? "Green" : months >= 3 ? "Amber" : "Red"
    return {
      preferenceId,
      rating,
      note: meets
        ? `Reserves cover ${months.toFixed(1)} months — meets the 6-month minimum.`
        : `Reserves cover ${months.toFixed(1)} months — below the 6-month minimum.`,
      meetsRequirement: meets,
      hasSubmittedInfo: true,
    }
  }

  if (preferenceId === "pref-years-5") {
    const years = yearsSinceRegistration(charity)
    if (years === null) {
      return {
        preferenceId,
        rating: "N/A",
        note: "Registration date not available.",
        meetsRequirement: false,
        hasSubmittedInfo: true,
      }
    }
    const meets = years >= 5
    const rating: Rating = meets ? "Green" : years >= 3 ? "Amber" : "Red"
    const registeredYear = charity.charityCommission.dateRegistered
      ? new Date(charity.charityCommission.dateRegistered).getFullYear()
      : null
    return {
      preferenceId,
      rating,
      note: meets
        ? `Registered since ${registeredYear} — operating for ${Math.floor(years)} years.`
        : `Registered since ${registeredYear} — only ${Math.floor(years)} years of operation.`,
      meetsRequirement: meets,
      hasSubmittedInfo: true,
    }
  }

  const ddResult = ddResults.find((r) => r.requirementId === preference.requirementId)
  const submitted = hasSubmittedInfo(charity, preference.informationItemId)
  const meets = ddResult?.rating === "Green" && submitted

  return {
    preferenceId,
    rating: ddResult?.rating ?? "N/A",
    note: ddResult?.note ?? "No data available.",
    meetsRequirement: meets,
    hasSubmittedInfo: submitted,
  }
}

export function checkCharityAgainstPreferences(
  charity: Charity,
  preferenceIds: string[],
  year?: number,
): PreferenceCheckResult[] {
  const yearData =
    charity.years.find((y) => y.year === year) ??
    charity.years.reduce((a, b) => (a.year > b.year ? a : b))
  const ddSummary = evaluateFunderRequirements(charity, yearData)

  return preferenceIds.map((id) =>
    evaluatePreference(id, charity, yearData, ddSummary.results),
  )
}

export interface FilteredCharityResult {
  charity: Charity
  checks: PreferenceCheckResult[]
  matchCount: number
  totalSelected: number
  passesAll: boolean
}

export function filterCharitiesByPreferences(
  charities: Charity[],
  preferenceIds: string[],
): FilteredCharityResult[] {
  if (preferenceIds.length === 0) {
    return charities.map((charity) => ({
      charity,
      checks: [],
      matchCount: 0,
      totalSelected: 0,
      passesAll: true,
    }))
  }

  return charities
    .map((charity) => {
      const checks = checkCharityAgainstPreferences(charity, preferenceIds)
      const matchCount = checks.filter((c) => c.meetsRequirement).length
      const passesAll = checks.every((c) => c.meetsRequirement)
      return {
        charity,
        checks,
        matchCount,
        totalSelected: preferenceIds.length,
        passesAll,
      }
    })
    .sort((a, b) => {
      if (a.passesAll !== b.passesAll) return a.passesAll ? -1 : 1
      return b.matchCount - a.matchCount
    })
}

export function getPreferenceLabel(preferenceId: string): string {
  return FUND_PREFERENCES_BY_ID[preferenceId]?.label ?? preferenceId
}

export function getSharedPlatformEntries(charity: Charity) {
  return charity.updateHistory.filter((entry) => entry.isShared)
}
