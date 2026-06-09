import {
  DEFAULT_FUND_CRITERIA,
  type FundCriteriaConfig,
} from "./fund-preferences"

export type FundVisibilityMode =
  | "name-and-amount"
  | "name-only"
  | "anonymous"
  | "bmfn-network"

export interface FundVisibilityConfig {
  mode: FundVisibilityMode
  /** Shown when mode is name-and-amount */
  grantAmountGbp: number
}

export interface FundSettings {
  criteria: FundCriteriaConfig
  visibility: FundVisibilityConfig
}

export const FUND_VISIBILITY_OPTIONS: {
  mode: FundVisibilityMode
  label: string
  description: string
}[] = [
  {
    mode: "name-and-amount",
    label: "Fund name + funding amount",
    description: "Other funders can see your organisation name and grant amounts on the platform.",
  },
  {
    mode: "name-only",
    label: "Fund name only",
    description: "Your organisation name is visible, but grant amounts are not shared.",
  },
  {
    mode: "anonymous",
    label: "Anonymous to all",
    description: "Your activity appears as “A funder” — no name or amounts shown.",
  },
  {
    mode: "bmfn-network",
    label: "Anonymous except to BMFN network",
    description:
      "Anonymous to the wider platform. BMFN network members can see your fund name.",
  },
]

export const DEFAULT_FUND_VISIBILITY: FundVisibilityConfig = {
  mode: "name-only",
  grantAmountGbp: 250_000,
}

export const DEFAULT_FUND_SETTINGS: FundSettings = {
  criteria: structuredClone(DEFAULT_FUND_CRITERIA),
  visibility: { ...DEFAULT_FUND_VISIBILITY },
}

const STORAGE_KEY = "impact-engine-fund-settings"
const LEGACY_CRITERIA_KEY = "impact-engine-fund-criteria"

export function loadFundSettings(): FundSettings {
  if (typeof window === "undefined") return structuredClone(DEFAULT_FUND_SETTINGS)
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as FundSettings
      return {
        criteria: {
          enabled: { ...DEFAULT_FUND_CRITERIA.enabled, ...parsed.criteria?.enabled },
          values: { ...DEFAULT_FUND_CRITERIA.values, ...parsed.criteria?.values },
        },
        visibility: { ...DEFAULT_FUND_VISIBILITY, ...parsed.visibility },
      }
    }
    const legacyRaw = localStorage.getItem(LEGACY_CRITERIA_KEY)
    if (legacyRaw) {
      const legacyCriteria = JSON.parse(legacyRaw) as FundCriteriaConfig
      return {
        criteria: {
          enabled: { ...DEFAULT_FUND_CRITERIA.enabled, ...legacyCriteria.enabled },
          values: { ...DEFAULT_FUND_CRITERIA.values, ...legacyCriteria.values },
        },
        visibility: { ...DEFAULT_FUND_VISIBILITY },
      }
    }
    return structuredClone(DEFAULT_FUND_SETTINGS)
  } catch {
    return structuredClone(DEFAULT_FUND_SETTINGS)
  }
}

export function saveFundSettings(settings: FundSettings): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  // Keep legacy key in sync for any code still reading criteria directly
  localStorage.setItem(LEGACY_CRITERIA_KEY, JSON.stringify(settings.criteria))
}

/** What other platform users see for this fund's activity */
export function getPublicVisibilityLabel(
  funderName: string,
  visibility: FundVisibilityConfig,
): string {
  switch (visibility.mode) {
    case "name-and-amount":
      return `${funderName} · £${visibility.grantAmountGbp.toLocaleString("en-GB")}`
    case "name-only":
      return funderName
    case "anonymous":
      return "A funder (anonymous)"
    case "bmfn-network":
      return "A funder (anonymous to platform)"
    default:
      return funderName
  }
}

/** What BMFN network members see when mode is bmfn-network */
export function getBmfnVisibilityLabel(funderName: string): string {
  return funderName
}

export function getVisibilityModeLabel(mode: FundVisibilityMode): string {
  return FUND_VISIBILITY_OPTIONS.find((o) => o.mode === mode)?.label ?? mode
}

export interface ResolvedFunderDisplay {
  displayName: string
  isAnonymous: boolean
  note?: string
}

export function resolveFunderDisplayForRequest(
  funderName: string,
  funderId: string,
  visibility: FundVisibilityConfig,
): ResolvedFunderDisplay {
  switch (visibility.mode) {
    case "name-and-amount":
      return {
        displayName: `${funderName} · £${visibility.grantAmountGbp.toLocaleString("en-GB")}`,
        isAnonymous: false,
      }
    case "name-only":
      return { displayName: funderName, isAnonymous: false }
    case "anonymous":
      return { displayName: "A funder", isAnonymous: true }
    case "bmfn-network":
      return {
        displayName: "A funder",
        isAnonymous: true,
        note: `Visible as ${funderName} to BMFN network members only`,
      }
    default:
      return { displayName: funderName, isAnonymous: false }
  }
}
