export interface Charity {
  id: string
  slug: string
  name: string
  registrationNumber: string
  country: string
  isIslamicCharity: boolean
  categories: string[]
  years: CharityYear[]
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
