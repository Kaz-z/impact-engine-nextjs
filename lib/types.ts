export interface CharityCommissionData {
  status: "Registered" | "Removed" | "Dissolved"
  registerUrl: string
  latestIncome: number
  latestExpenditure: number
  financialYearEnd: string
  filingStatus: "Filed on time" | "Overdue" | "Not yet due"
  lastAccountsDate: string
  registeredAddress: string
  charitableObjects: string
  dateRegistered?: string
}

export interface Trustee {
  id: string
  name: string
  role?: string
  appointedDate?: string
}

export type InformationStatus = "present" | "missing" | "outdated"

export interface InformationItemStatus {
  itemId: string
  status: InformationStatus
  lastUpdated?: string
  documentUrl?: string | null
  notes?: string
}

export interface FunderRef {
  id: string
  displayName: string
  isAnonymous: boolean
}

export interface UpdateRequestItem {
  informationItemId: string
  status: "requested" | "provided" | "declined"
  providedAt?: string
  documentLabel?: string
}

export interface UpdateRequest {
  id: string
  charityId: string
  requestedBy: FunderRef
  requestedAt: string
  message?: string
  items: UpdateRequestItem[]
  status: "sent" | "partially_fulfilled" | "fulfilled" | "closed"
}

export interface UpdateHistoryEntry {
  id: string
  date: string
  title: string
  description: string
  requestedBy: FunderRef
  informationItemId?: string
  isShared: boolean
}

export interface Charity {
  id: string
  slug: string
  name: string
  registrationNumber: string
  country: string
  isIslamicCharity: boolean
  categories: string[]
  years: CharityYear[]
  charityCommission: CharityCommissionData
  trustees: Trustee[]
  website?: string | null
  contactEmail?: string | null
  informationStatus: InformationItemStatus[]
  updateHistory: UpdateHistoryEntry[]
}

export interface CharityYear {
  year: number
  finance: {
    incomeTrend: number
    incomeTrendRating: Rating
    operatingSurplusDeficit: number
    operatingSurplusDeficitRating: Rating
    fundraisingEfficiency: number
    fundraisingEfficiencyRating: Rating
    reservesCoverage: number
    reservesCoverageRating: Rating
  }
  operationalCosts: {
    charitableSpendingEfficiency: number
    charitableSpendingEfficiencyRating: Rating
    fundraisingAndMarketingEfficiency: number
    fundraisingAndMarketingEfficiencyRating: Rating
  }
  governance: {
    numberOfTrustees: number
    numberOfTrusteesRating: Rating
    governancePoliciesUpToDate: boolean
    governancePoliciesUpToDateRating: Rating
    annualReturnsSubmittedOnTime: boolean
    annualReturnsSubmittedOnTimeRating: Rating
  }
  compliance: {
    zakatPolicyCompliance: string | null
    zakatPolicyComplianceRating: Rating
    safeguardingAndDataProtectionPolicies: string
    safeguardingAndDataProtectionPoliciesRating: Rating
    gdprCompliance: string
    gdprComplianceRating: Rating
    healthAndSafetyCompliance: string
    healthAndSafetyComplianceRating: Rating
  }
}

export type Rating = "Green" | "Amber" | "Red" | "N/A"

export interface CharityData {
  version: string
  generatedAt: string
  charities: Charity[]
  ratingLegend: Record<Rating, string>
}

export type CharityCore = Omit<
  Charity,
  "charityCommission" | "trustees" | "website" | "contactEmail" | "informationStatus" | "updateHistory"
>
