import type { Charity, CharityYear, InformationItemStatus, Rating } from "./types"
import { formatCurrency } from "./charity-metadata"

export type FundCriterionId =
  | "reserves-min"
  | "operating-years"
  | "accounts-filed"
  | "min-income"
  | "charitable-spend"
  | "trustees"
  | "safeguarding"
  | "gdpr"
  | "insurance"
  | "fundraising"

export type FundCriteriaValues = {
  minReservesMonths: number
  minOperatingYears: number
  minIncomeGbp: number
  minCharitableSpendPercent: number
  minTrustees: number
  maxTrustees: number
  maxFundraisingPercent: number
}

export interface FundCriteriaConfig {
  enabled: Record<FundCriterionId, boolean>
  values: FundCriteriaValues
}

export type FundCriterionCategory = "Financial" | "Governance" | "Compliance" | "Operational"

export interface FundCriterionDefinition {
  id: FundCriterionId
  category: FundCriterionCategory
  description: string
  /** Single configurable value key */
  valueKey?: keyof FundCriteriaValues
  /** Multiple value keys (e.g. trustee range) */
  valueKeys?: (keyof FundCriteriaValues)[]
  informationItemId?: string
}

export const FUND_CRITERION_IDS: FundCriterionId[] = [
  "reserves-min",
  "operating-years",
  "accounts-filed",
  "min-income",
  "charitable-spend",
  "trustees",
  "safeguarding",
  "gdpr",
  "insurance",
  "fundraising",
]

export const FUND_CRITERIA_CATALOG: FundCriterionDefinition[] = [
  {
    id: "reserves-min",
    category: "Financial",
    description: "Operating reserves must cover at least this many months of expenditure.",
    valueKey: "minReservesMonths",
  },
  {
    id: "operating-years",
    category: "Operational",
    description: "Charity must have been registered for at least this many years.",
    valueKey: "minOperatingYears",
  },
  {
    id: "accounts-filed",
    category: "Financial",
    description: "Latest annual accounts submitted before the regulatory deadline.",
    informationItemId: "accounts-latest",
  },
  {
    id: "min-income",
    category: "Financial",
    description: "Annual income meets your minimum grant threshold.",
    valueKey: "minIncomeGbp",
    informationItemId: "accounts-latest",
  },
  {
    id: "charitable-spend",
    category: "Financial",
    description: "Minimum percentage of expenditure on charitable activities.",
    valueKey: "minCharitableSpendPercent",
  },
  {
    id: "trustees",
    category: "Governance",
    description: "Trustee board size within your acceptable range.",
    valueKeys: ["minTrustees", "maxTrustees"],
    informationItemId: "trustee-register",
  },
  {
    id: "safeguarding",
    category: "Compliance",
    description: "Current safeguarding policy submitted and available on platform.",
    informationItemId: "safeguarding-policy",
  },
  {
    id: "gdpr",
    category: "Compliance",
    description: "Data protection policies documented and on file.",
    informationItemId: "gdpr-policy",
  },
  {
    id: "insurance",
    category: "Compliance",
    description: "Public liability and employers' liability insurance in place.",
    informationItemId: "insurance-certificate",
  },
  {
    id: "fundraising",
    category: "Financial",
    description: "Maximum fundraising cost as a percentage of income.",
    valueKey: "maxFundraisingPercent",
  },
]

export const FUND_CRITERIA_BY_ID = Object.fromEntries(
  FUND_CRITERIA_CATALOG.map((c) => [c.id, c]),
) as Record<FundCriterionId, FundCriterionDefinition>

export const DEFAULT_FUND_CRITERIA_VALUES: FundCriteriaValues = {
  minReservesMonths: 6,
  minOperatingYears: 5,
  minIncomeGbp: 500_000,
  minCharitableSpendPercent: 70,
  minTrustees: 5,
  maxTrustees: 12,
  maxFundraisingPercent: 25,
}

export const DEFAULT_FUND_CRITERIA: FundCriteriaConfig = {
  enabled: {
    "reserves-min": true,
    "operating-years": true,
    "accounts-filed": true,
    "min-income": false,
    "charitable-spend": false,
    trustees: false,
    safeguarding: true,
    gdpr: false,
    insurance: false,
    fundraising: false,
  },
  values: { ...DEFAULT_FUND_CRITERIA_VALUES },
}

const STORAGE_KEY = "impact-engine-fund-criteria"
const LEGACY_STORAGE_KEY = "impact-engine-fund-preferences"

const LEGACY_ID_MAP: Record<string, FundCriterionId> = {
  "pref-reserves-6": "reserves-min",
  "pref-years-5": "operating-years",
  "dd-accounts-filed": "accounts-filed",
  "dd-min-income": "min-income",
  "dd-reserves": "reserves-min",
  "dd-charitable-spend": "charitable-spend",
  "dd-trustees": "trustees",
  "dd-safeguarding": "safeguarding",
  "dd-gdpr": "gdpr",
  "dd-insurance": "insurance",
  "dd-fundraising": "fundraising",
}

function migrateLegacyPreferences(legacyIds: string[]): FundCriteriaConfig {
  const config = structuredClone(DEFAULT_FUND_CRITERIA)
  for (const id of FUND_CRITERION_IDS) {
    config.enabled[id] = false
  }
  for (const legacyId of legacyIds) {
    const mapped = LEGACY_ID_MAP[legacyId]
    if (mapped) config.enabled[mapped] = true
  }
  return config
}

export function loadFundCriteria(): FundCriteriaConfig {
  // Delegates to unified fund settings when available (client-side only)
  if (typeof window !== "undefined") {
    try {
      const settingsRaw = localStorage.getItem("impact-engine-fund-settings")
      if (settingsRaw) {
        const parsed = JSON.parse(settingsRaw) as { criteria?: FundCriteriaConfig }
        if (parsed.criteria) {
          return {
            enabled: { ...DEFAULT_FUND_CRITERIA.enabled, ...parsed.criteria.enabled },
            values: { ...DEFAULT_FUND_CRITERIA_VALUES, ...parsed.criteria.values },
          }
        }
      }
    } catch {
      // fall through
    }
  }
  if (typeof window === "undefined") return structuredClone(DEFAULT_FUND_CRITERIA)
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as FundCriteriaConfig
      return {
        enabled: { ...DEFAULT_FUND_CRITERIA.enabled, ...parsed.enabled },
        values: { ...DEFAULT_FUND_CRITERIA_VALUES, ...parsed.values },
      }
    }
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacyRaw) {
      const legacyIds = JSON.parse(legacyRaw) as string[]
      if (legacyIds.length > 0) return migrateLegacyPreferences(legacyIds)
    }
    return structuredClone(DEFAULT_FUND_CRITERIA)
  } catch {
    return structuredClone(DEFAULT_FUND_CRITERIA)
  }
}

export function saveFundCriteria(config: FundCriteriaConfig): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function getEnabledCriterionIds(config: FundCriteriaConfig): FundCriterionId[] {
  return FUND_CRITERION_IDS.filter((id) => config.enabled[id])
}

export function formatCriterionLabel(id: FundCriterionId, values: FundCriteriaValues): string {
  switch (id) {
    case "reserves-min":
      return `At least ${values.minReservesMonths} months of reserves`
    case "operating-years":
      return `Operating for ${values.minOperatingYears}+ years`
    case "accounts-filed":
      return "Accounts filed on time"
    case "min-income":
      return `Minimum annual income (${formatCurrency(values.minIncomeGbp)})`
    case "charitable-spend":
      return `Charitable spending ≥ ${values.minCharitableSpendPercent}%`
    case "trustees":
      return `Trustee board (${values.minTrustees}–${values.maxTrustees})`
    case "safeguarding":
      return "Safeguarding policy on file"
    case "gdpr":
      return "GDPR compliance documented"
    case "insurance":
      return "Valid insurance certificate"
    case "fundraising":
      return `Fundraising cost ≤ ${values.maxFundraisingPercent}%`
    default:
      return id
  }
}

export interface PreferenceCheckResult {
  criterionId: FundCriterionId
  label: string
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

function evaluateCriterion(
  id: FundCriterionId,
  charity: Charity,
  yearData: CharityYear,
  config: FundCriteriaConfig,
): PreferenceCheckResult {
  const { values } = config
  const definition = FUND_CRITERIA_BY_ID[id]
  const label = formatCriterionLabel(id, values)
  const submitted = hasSubmittedInfo(charity, definition.informationItemId)

  switch (id) {
    case "reserves-min": {
      const months = yearData.finance.reservesCoverage
      const min = values.minReservesMonths
      const meets = months >= min
      const amberThreshold = Math.max(min * 0.5, min - 3)
      const rating: Rating = meets ? "Green" : months >= amberThreshold ? "Amber" : "Red"
      return {
        criterionId: id,
        label,
        rating,
        note: meets
          ? `Reserves cover ${months.toFixed(1)} months — meets your ${min}-month minimum.`
          : `Reserves cover ${months.toFixed(1)} months — below your ${min}-month minimum.`,
        meetsRequirement: meets,
        hasSubmittedInfo: true,
      }
    }

    case "operating-years": {
      const years = yearsSinceRegistration(charity)
      const min = values.minOperatingYears
      if (years === null) {
        return {
          criterionId: id,
          label,
          rating: "N/A",
          note: "Registration date not available.",
          meetsRequirement: false,
          hasSubmittedInfo: true,
        }
      }
      const meets = years >= min
      const registeredYear = charity.charityCommission.dateRegistered
        ? new Date(charity.charityCommission.dateRegistered).getFullYear()
        : null
      const rating: Rating = meets ? "Green" : years >= min - 2 ? "Amber" : "Red"
      return {
        criterionId: id,
        label,
        rating,
        note: meets
          ? `Registered since ${registeredYear} — operating for ${Math.floor(years)} years.`
          : `Registered since ${registeredYear} — only ${Math.floor(years)} years (minimum ${min}).`,
        meetsRequirement: meets,
        hasSubmittedInfo: true,
      }
    }

    case "accounts-filed": {
      const { filingStatus, financialYearEnd, lastAccountsDate } = charity.charityCommission
      let rating: Rating
      let note: string
      let meets: boolean
      if (filingStatus === "Filed on time") {
        rating = "Green"
        meets = true
        note = `Latest accounts for year ending ${financialYearEnd} filed on time (${new Date(lastAccountsDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}).`
      } else if (filingStatus === "Not yet due") {
        rating = "Amber"
        meets = false
        note = "Accounts are not yet due. Confirm submission date before funding."
      } else {
        rating = "Red"
        meets = false
        note = "Accounts are overdue with the Charity Commission."
      }
      return {
        criterionId: id,
        label,
        rating,
        note,
        meetsRequirement: meets && submitted,
        hasSubmittedInfo: submitted,
      }
    }

    case "min-income": {
      const income = charity.charityCommission.latestIncome
      const threshold = values.minIncomeGbp
      const meets = income >= threshold
      const rating: Rating = meets ? "Green" : income >= threshold / 2 ? "Amber" : "Red"
      return {
        criterionId: id,
        label,
        rating,
        note: meets
          ? `Annual income of ${formatCurrency(income)} meets your ${formatCurrency(threshold)} threshold.`
          : `Annual income of ${formatCurrency(income)} is below your ${formatCurrency(threshold)} threshold.`,
        meetsRequirement: meets && submitted,
        hasSubmittedInfo: submitted,
      }
    }

    case "charitable-spend": {
      const pct = yearData.operationalCosts.charitableSpendingEfficiency * 100
      const min = values.minCharitableSpendPercent
      const meets = pct >= min
      const rating: Rating = meets ? "Green" : pct >= min - 10 ? "Amber" : "Red"
      return {
        criterionId: id,
        label,
        rating,
        note: meets
          ? `${pct.toFixed(0)}% charitable spending — meets your ${min}% minimum.`
          : `${pct.toFixed(0)}% charitable spending — below your ${min}% minimum.`,
        meetsRequirement: meets,
        hasSubmittedInfo: true,
      }
    }

    case "trustees": {
      const count = yearData.governance.numberOfTrustees
      const { minTrustees, maxTrustees } = values
      const meets = count >= minTrustees && count <= maxTrustees
      let rating: Rating
      if (meets) rating = "Green"
      else if (count >= minTrustees - 1 && count <= maxTrustees + 1) rating = "Amber"
      else rating = "Red"
      return {
        criterionId: id,
        label,
        rating,
        note: meets
          ? `${count} trustees — within your ${minTrustees}–${maxTrustees} range.`
          : `${count} trustees — outside your ${minTrustees}–${maxTrustees} range.`,
        meetsRequirement: meets && submitted,
        hasSubmittedInfo: submitted,
      }
    }

    case "safeguarding":
    case "gdpr":
    case "insurance": {
      const item = charity.informationStatus.find((i) => i.itemId === definition.informationItemId)
      const meets = item?.status === "present"
      const rating: Rating =
        item?.status === "present" ? "Green" : item?.status === "outdated" ? "Amber" : "Red"
      const docLabel = label.toLowerCase()
      return {
        criterionId: id,
        label,
        rating,
        note:
          item?.status === "present"
            ? `${label} is on file.`
            : item?.status === "outdated"
              ? `${label} may be out of date.${item.notes ? ` ${item.notes}` : ""}`
              : `No ${docLabel} on file.`,
        meetsRequirement: meets,
        hasSubmittedInfo: submitted,
      }
    }

    case "fundraising": {
      const pct = yearData.finance.fundraisingEfficiency * 100
      const max = values.maxFundraisingPercent
      if (yearData.finance.fundraisingEfficiencyRating === "N/A") {
        return {
          criterionId: id,
          label,
          rating: "N/A",
          note: "Fundraising efficiency data is not available.",
          meetsRequirement: false,
          hasSubmittedInfo: true,
        }
      }
      const meets = pct <= max
      const rating: Rating = meets ? "Green" : pct <= max + 10 ? "Amber" : "Red"
      return {
        criterionId: id,
        label,
        rating,
        note: meets
          ? `Fundraising costs ${pct.toFixed(0)}% of income — within your ${max}% maximum.`
          : `Fundraising costs ${pct.toFixed(0)}% of income — above your ${max}% maximum.`,
        meetsRequirement: meets,
        hasSubmittedInfo: true,
      }
    }

    default:
      return {
        criterionId: id,
        label,
        rating: "N/A",
        note: "Unknown criterion",
        meetsRequirement: false,
        hasSubmittedInfo: false,
      }
  }
}

export function checkCharityAgainstCriteria(
  charity: Charity,
  config: FundCriteriaConfig,
  year?: number,
): PreferenceCheckResult[] {
  const enabledIds = getEnabledCriterionIds(config)
  const yearData =
    charity.years.find((y) => y.year === year) ??
    charity.years.reduce((a, b) => (a.year > b.year ? a : b))

  return enabledIds.map((id) => evaluateCriterion(id, charity, yearData, config))
}

export interface FilteredCharityResult {
  charity: Charity
  checks: PreferenceCheckResult[]
  matchCount: number
  totalSelected: number
  passesAll: boolean
}

export function filterCharitiesByCriteria(
  charities: Charity[],
  config: FundCriteriaConfig,
): FilteredCharityResult[] {
  const enabledIds = getEnabledCriterionIds(config)

  if (enabledIds.length === 0) {
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
      const checks = checkCharityAgainstCriteria(charity, config)
      const matchCount = checks.filter((c) => c.meetsRequirement).length
      const passesAll = checks.every((c) => c.meetsRequirement)
      return {
        charity,
        checks,
        matchCount,
        totalSelected: enabledIds.length,
        passesAll,
      }
    })
    .sort((a, b) => {
      if (a.passesAll !== b.passesAll) return a.passesAll ? -1 : 1
      return b.matchCount - a.matchCount
    })
}

export function getSharedPlatformEntries(charity: Charity) {
  return charity.updateHistory.filter((entry) => entry.isShared)
}

/** Information items to request based on failed fund criteria (not all profile gaps) */
export function getCriteriaGapRequestItems(
  checks: PreferenceCheckResult[],
  informationStatus: InformationItemStatus[],
): InformationItemStatus[] {
  const failed = checks.filter((c) => !c.meetsRequirement)
  const itemIds = new Set<string>()

  for (const check of failed) {
    const def = FUND_CRITERIA_BY_ID[check.criterionId]
    if (def?.informationItemId) {
      const item = informationStatus.find((i) => i.itemId === def.informationItemId)
      if (item && (item.status === "missing" || item.status === "outdated")) {
        itemIds.add(def.informationItemId)
      }
    }
    // Reserves are derived from financials — request updated accounts to verify
    if (check.criterionId === "reserves-min") {
      itemIds.add("accounts-latest")
    }
  }

  return informationStatus.filter((i) => itemIds.has(i.itemId))
}
