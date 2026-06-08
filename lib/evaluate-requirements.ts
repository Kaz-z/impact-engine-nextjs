import type { Charity, CharityYear, InformationItemStatus, Rating } from "./types"
import { FUNDER_REQUIREMENTS } from "./funder-requirements"
import { formatCurrency } from "./charity-metadata"

export interface FunderRequirementResult {
  requirementId: string
  rating: Rating
  note: string
}

export interface DueDiligenceSummary {
  results: FunderRequirementResult[]
  redCount: number
  amberCount: number
  greenCount: number
  overallRating: Rating
}

const MIN_INCOME_THRESHOLD = 500_000

function getInfoItem(charity: Charity, itemId: string): InformationItemStatus | undefined {
  return charity.informationStatus.find((item) => item.itemId === itemId)
}

function ratingFromInfoStatus(item: InformationItemStatus | undefined, labels: {
  present: string
  outdated: string
  missing: string
}): FunderRequirementResult["rating"] {
  if (!item || item.status === "missing") return "Red"
  if (item.status === "outdated") return "Amber"
  return "Green"
}

function noteFromInfoStatus(
  item: InformationItemStatus | undefined,
  labels: { present: string; outdated: string; missing: string },
): string {
  if (!item || item.status === "missing") return labels.missing
  if (item.status === "outdated") {
    return item.notes ? `${labels.outdated} ${item.notes}` : labels.outdated
  }
  if (item.lastUpdated) {
    const date = new Date(item.lastUpdated).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    })
    return `${labels.present} Last updated ${date}.`
  }
  return labels.present
}

function evaluateRegistered(charity: Charity): FunderRequirementResult {
  const registered = charity.charityCommission.status === "Registered"
  return {
    requirementId: "dd-registered",
    rating: registered ? "Green" : "Red",
    note: registered
      ? "Charity is actively registered with the Charity Commission."
      : `Charity status is "${charity.charityCommission.status}". Cannot proceed with funding.`,
  }
}

function evaluateAccountsFiled(charity: Charity): FunderRequirementResult {
  const { filingStatus, financialYearEnd, lastAccountsDate } = charity.charityCommission
  if (filingStatus === "Filed on time") {
    return {
      requirementId: "dd-accounts-filed",
      rating: "Green",
      note: `Latest accounts for year ending ${financialYearEnd} were submitted before the deadline (filed ${new Date(lastAccountsDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}).`,
    }
  }
  if (filingStatus === "Not yet due") {
    return {
      requirementId: "dd-accounts-filed",
      rating: "Amber",
      note: "Accounts are not yet due. Confirm submission date before making a funding decision.",
    }
  }
  return {
    requirementId: "dd-accounts-filed",
    rating: "Red",
    note: "Accounts are overdue with the Charity Commission. Request an update before proceeding.",
  }
}

function evaluateMinIncome(charity: Charity): FunderRequirementResult {
  const income = charity.charityCommission.latestIncome
  if (income >= MIN_INCOME_THRESHOLD) {
    return {
      requirementId: "dd-min-income",
      rating: "Green",
      note: `Annual income of ${formatCurrency(income)} meets the minimum threshold of ${formatCurrency(MIN_INCOME_THRESHOLD)}.`,
    }
  }
  if (income >= MIN_INCOME_THRESHOLD / 2) {
    return {
      requirementId: "dd-min-income",
      rating: "Amber",
      note: `Annual income of ${formatCurrency(income)} is below the ${formatCurrency(MIN_INCOME_THRESHOLD)} threshold but may qualify for smaller grants.`,
    }
  }
  return {
    requirementId: "dd-min-income",
    rating: "Red",
    note: `Annual income of ${formatCurrency(income)} is below the minimum threshold of ${formatCurrency(MIN_INCOME_THRESHOLD)}.`,
  }
}

function evaluateTrustees(yearData: CharityYear): FunderRequirementResult {
  const count = yearData.governance.numberOfTrustees
  if (count >= 5 && count <= 12) {
    return {
      requirementId: "dd-trustees",
      rating: "Green",
      note: `${count} trustees on the board — within the recommended range of 5–12.`,
    }
  }
  if (count === 4 || count === 13) {
    return {
      requirementId: "dd-trustees",
      rating: "Amber",
      note: `${count} trustees — slightly outside the recommended range of 5–12. Review board composition.`,
    }
  }
  return {
    requirementId: "dd-trustees",
    rating: count < 5 ? "Red" : "Amber",
    note:
      count < 5
        ? `Only ${count} trustees — below minimum for effective oversight. Request board expansion.`
        : `${count} trustees — above recommended maximum. May affect decision-making efficiency.`,
  }
}

function evaluateSafeguarding(charity: Charity): FunderRequirementResult {
  const item = getInfoItem(charity, "safeguarding-policy")
  return {
    requirementId: "dd-safeguarding",
    rating: ratingFromInfoStatus(item, { present: "g", outdated: "a", missing: "m" }),
    note: noteFromInfoStatus(item, {
      present: "Safeguarding policy is on file.",
      outdated: "Safeguarding policy may be out of date.",
      missing: "No safeguarding policy on file. Request from charity before proceeding.",
    }),
  }
}

function evaluateGdpr(charity: Charity, yearData: CharityYear): FunderRequirementResult {
  const item = getInfoItem(charity, "gdpr-policy")
  const complianceRating = yearData.compliance.gdprComplianceRating

  if (item?.status === "present") {
    return {
      requirementId: "dd-gdpr",
      rating: "Green",
      note: noteFromInfoStatus(item, {
        present: "Data protection / GDPR policy is documented.",
        outdated: "",
        missing: "",
      }),
    }
  }
  if (item?.status === "outdated" || complianceRating === "Amber") {
    return {
      requirementId: "dd-gdpr",
      rating: "Amber",
      note:
        item?.notes ??
        `GDPR compliance is "${yearData.compliance.gdprCompliance}". Policy may need updating.`,
    }
  }
  if (item?.status === "missing" || complianceRating === "Red") {
    return {
      requirementId: "dd-gdpr",
      rating: "Red",
      note: "GDPR compliance is not adequately documented. Request policy from charity.",
    }
  }
  return {
    requirementId: "dd-gdpr",
    rating: "Green",
    note: `GDPR status: ${yearData.compliance.gdprCompliance}.`,
  }
}

function evaluateCharitableSpend(yearData: CharityYear): FunderRequirementResult {
  const pct = yearData.operationalCosts.charitableSpendingEfficiency * 100
  if (pct >= 70) {
    return {
      requirementId: "dd-charitable-spend",
      rating: "Green",
      note: `${pct.toFixed(0)}% of expenditure goes to charitable activities — meets the 70% minimum.`,
    }
  }
  if (pct >= 60) {
    return {
      requirementId: "dd-charitable-spend",
      rating: "Amber",
      note: `${pct.toFixed(0)}% charitable spending — below the 70% target but above 60%.`,
    }
  }
  return {
    requirementId: "dd-charitable-spend",
    rating: "Red",
    note: `${pct.toFixed(0)}% charitable spending — below the 70% minimum threshold.`,
  }
}

function evaluateReserves(yearData: CharityYear): FunderRequirementResult {
  const months = yearData.finance.reservesCoverage
  if (months >= 3 && months <= 6) {
    return {
      requirementId: "dd-reserves",
      rating: "Green",
      note: `Reserves cover ${months.toFixed(1)} months — within the healthy 3–6 month range.`,
    }
  }
  if (months >= 2 && months < 3) {
    return {
      requirementId: "dd-reserves",
      rating: "Amber",
      note: `Reserves cover ${months.toFixed(1)} months — below the 3-month minimum but not critical.`,
    }
  }
  if (months > 6 && months <= 12) {
    return {
      requirementId: "dd-reserves",
      rating: "Amber",
      note: `Reserves cover ${months.toFixed(1)} months — above the 6-month maximum. Review whether funds are being deployed effectively.`,
    }
  }
  if (months > 12) {
    return {
      requirementId: "dd-reserves",
      rating: "Amber",
      note: `Reserves cover ${months.toFixed(1)} months — significantly above target. May indicate under-spending.`,
    }
  }
  return {
    requirementId: "dd-reserves",
    rating: months === 0 ? "Red" : "Red",
    note:
      months === 0
        ? "No reserves data available. Request financial information from charity."
        : `Reserves cover only ${months.toFixed(1)} months — critically low.`,
  }
}

function evaluateFundraising(yearData: CharityYear): FunderRequirementResult {
  const pct = yearData.finance.fundraisingEfficiency * 100
  if (yearData.finance.fundraisingEfficiencyRating === "N/A") {
    return {
      requirementId: "dd-fundraising",
      rating: "N/A",
      note: "Fundraising efficiency data is not available for this charity.",
    }
  }
  if (pct <= 25) {
    return {
      requirementId: "dd-fundraising",
      rating: "Green",
      note: `Fundraising costs ${pct.toFixed(0)}% of income — within the 25% maximum.`,
    }
  }
  if (pct <= 35) {
    return {
      requirementId: "dd-fundraising",
      rating: "Amber",
      note: `Fundraising costs ${pct.toFixed(0)}% of income — above the 25% target.`,
    }
  }
  return {
    requirementId: "dd-fundraising",
    rating: "Red",
    note: `Fundraising costs ${pct.toFixed(0)}% of income — significantly above the 25% maximum.`,
  }
}

function evaluateConflict(charity: Charity): FunderRequirementResult {
  const item = getInfoItem(charity, "conflict-of-interest")
  return {
    requirementId: "dd-conflict",
    rating: ratingFromInfoStatus(item, { present: "g", outdated: "a", missing: "m" }),
    note: noteFromInfoStatus(item, {
      present: "Conflict of interest register is on file.",
      outdated: "Conflict of interest register may be out of date.",
      missing: "No conflict of interest register on file. Request from charity.",
    }),
  }
}

function evaluateInsurance(charity: Charity): FunderRequirementResult {
  const item = getInfoItem(charity, "insurance-certificate")
  return {
    requirementId: "dd-insurance",
    rating: ratingFromInfoStatus(item, { present: "g", outdated: "a", missing: "m" }),
    note: noteFromInfoStatus(item, {
      present: "Valid insurance certificate is on file.",
      outdated: "Insurance certificate may be expired or out of date.",
      missing: "No insurance certificate on file. Request from charity before proceeding.",
    }),
  }
}

function evaluateBankVerified(charity: Charity): FunderRequirementResult {
  const item = getInfoItem(charity, "bank-details")
  return {
    requirementId: "dd-bank-verified",
    rating: ratingFromInfoStatus(item, { present: "g", outdated: "a", missing: "m" }),
    note: noteFromInfoStatus(item, {
      present: "Bank details have been independently verified.",
      outdated: "Bank details on file but verification is overdue.",
      missing: "Bank details have not been verified. Required before grant payment.",
    }),
  }
}

export function evaluateFunderRequirements(charity: Charity, yearData: CharityYear): DueDiligenceSummary {
  const results: FunderRequirementResult[] = [
    evaluateRegistered(charity),
    evaluateAccountsFiled(charity),
    evaluateMinIncome(charity),
    evaluateTrustees(yearData),
    evaluateSafeguarding(charity),
    evaluateGdpr(charity, yearData),
    evaluateCharitableSpend(yearData),
    evaluateReserves(yearData),
    evaluateFundraising(yearData),
    evaluateConflict(charity),
    evaluateInsurance(charity),
    evaluateBankVerified(charity),
  ]

  const rated = results.filter((r) => r.rating !== "N/A")
  const redCount = rated.filter((r) => r.rating === "Red").length
  const amberCount = rated.filter((r) => r.rating === "Amber").length
  const greenCount = rated.filter((r) => r.rating === "Green").length
  const overallRating: Rating = redCount > 0 ? "Red" : amberCount > 0 ? "Amber" : "Green"

  return { results, redCount, amberCount, greenCount, overallRating }
}

export function getRequirementLabel(requirementId: string): string {
  return FUNDER_REQUIREMENTS.find((r) => r.id === requirementId)?.label ?? requirementId
}

export interface InformationSummary {
  missingCount: number
  outdatedCount: number
  presentCount: number
  totalCount: number
  isComplete: boolean
}

export function summarizeInformationStatus(charity: Charity): InformationSummary {
  const missingCount = charity.informationStatus.filter((i) => i.status === "missing").length
  const outdatedCount = charity.informationStatus.filter((i) => i.status === "outdated").length
  const presentCount = charity.informationStatus.filter((i) => i.status === "present").length
  return {
    missingCount,
    outdatedCount,
    presentCount,
    totalCount: charity.informationStatus.length,
    isComplete: missingCount === 0 && outdatedCount === 0,
  }
}
