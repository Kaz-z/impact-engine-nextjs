import type {
  CharityCore,
  Charity,
  CharityCommissionData,
  InformationItemStatus,
  Trustee,
  UpdateHistoryEntry,
} from "./types"
import { REQUIRED_INFORMATION } from "./required-information"
import { DEMO_FUNDER } from "./funder-requirements"

export interface CharityMetadataOverride {
  charityCommission?: Partial<CharityCommissionData>
  trustees?: Trustee[]
  website?: string | null
  contactEmail?: string | null
  informationStatus?: InformationItemStatus[]
  updateHistory?: UpdateHistoryEntry[]
}

function ccRegisterUrl(registrationNumber: string): string {
  return `https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/${registrationNumber}`
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `£${(amount / 1_000_000).toFixed(1)}m`
  }
  if (amount >= 1_000) {
    return `£${(amount / 1_000).toFixed(0)}k`
  }
  return `£${amount.toFixed(0)}`
}

function defaultTrustees(count: number, prefix: string): Trustee[] {
  const names = [
    "Sarah Mitchell",
    "James Okonkwo",
    "Fatima Hassan",
    "David Chen",
    "Amira Patel",
    "Michael Thompson",
    "Zara Ahmed",
    "Robert Williams",
    "Layla Ibrahim",
    "Thomas Clarke",
    "Nadia Rahman",
    "Peter Davies",
  ]
  const roles = ["Chair", "Treasurer", "Secretary", "Trustee"]

  return Array.from({ length: Math.max(count, 3) }, (_, i) => ({
    id: `${prefix}-trustee-${i + 1}`,
    name: names[i % names.length],
    role: i === 0 ? "Chair" : roles[(i % 3) + 1] ?? "Trustee",
    appointedDate: `${2018 + (i % 5)}-${String((i % 12) + 1).padStart(2, "0")}-15`,
  })).slice(0, count)
}

function allPresent(lastUpdated = "2024-11-01"): InformationItemStatus[] {
  return REQUIRED_INFORMATION.map((item) => ({
    itemId: item.id,
    status: "present" as const,
    lastUpdated,
    documentUrl: null,
  }))
}

function buildInformationStatus(
  overrides: Record<string, Partial<InformationItemStatus>>,
  baseDate = "2024-11-01",
): InformationItemStatus[] {
  return REQUIRED_INFORMATION.map((item) => {
    const override = overrides[item.id]
    if (override) {
      return {
        itemId: item.id,
        status: override.status ?? "present",
        lastUpdated: override.lastUpdated,
        documentUrl: override.documentUrl ?? null,
        notes: override.notes,
      }
    }
    return {
      itemId: item.id,
      status: "present",
      lastUpdated: baseDate,
      documentUrl: null,
    }
  })
}

function deriveCharityCommission(charity: CharityCore, override?: Partial<CharityCommissionData>): CharityCommissionData {
  const latestYear = charity.years.reduce((a, b) => (a.year > b.year ? a : b))
  const onTime = latestYear.governance.annualReturnsSubmittedOnTime

  const incomeBase = Math.max(
    250_000,
    Math.round((latestYear.finance.incomeTrend + 10) * 150_000),
  )
  const expenditureBase = Math.round(incomeBase * (1 - latestYear.finance.operatingSurplusDeficit))

  return {
    status: "Registered",
    registerUrl: ccRegisterUrl(charity.registrationNumber),
    latestIncome: incomeBase,
    latestExpenditure: expenditureBase,
    financialYearEnd: "31 March 2024",
    filingStatus: onTime ? "Filed on time" : "Overdue",
    lastAccountsDate: onTime ? "2024-10-15" : "2023-09-20",
    registeredAddress: "Unit 4, Charity House, 12 High Street, London, E1 6AN",
    charitableObjects:
      `The relief of poverty, sickness and distress among ${charity.categories[0]?.toLowerCase() ?? "vulnerable"} communities, both in the United Kingdom and internationally, through the provision of grants, services and support.`,
    dateRegistered: "2010-03-15",
    ...override,
  }
}

const METADATA_OVERRIDES: Record<string, CharityMetadataOverride> = {
  "global-water-initiative": {
    charityCommission: {
      latestIncome: 8_400_000,
      latestExpenditure: 7_900_000,
      registeredAddress: "Water House, 45 Victoria Embankment, London, SW1A 2BN",
      charitableObjects:
        "To provide access to clean water and sanitation in developing countries, and to promote sustainable water management practices worldwide.",
    },
    website: "https://globalwaterinitiative.org.uk",
    contactEmail: "info@globalwaterinitiative.org.uk",
    informationStatus: allPresent("2024-10-20"),
    updateHistory: [],
  },
  "penny-appeal-uk": {
    charityCommission: {
      latestIncome: 13_136_985,
      latestExpenditure: 13_756_631,
      financialYearEnd: "31 December 2024",
      registeredAddress: "Unit 1, Fieldhouse Business Centre, Bradford, BD4 8TU",
      charitableObjects:
        "The prevention or relief of poverty anywhere in the world by providing or assisting in the provision of education, health projects and general welfare.",
    },
    website: "https://pennyappeal.org",
    contactEmail: "info@pennyappeal.org",
  },
  "action-for-humanity": {
    charityCommission: {
      latestIncome: 4_850_000,
      latestExpenditure: 4_490_000,
      registeredAddress: "Unit 7, Momentum Place, Bickenhill Lane, Birmingham, B37 7EG",
      charitableObjects:
        "To provide humanitarian aid and development assistance to people affected by conflict, disaster and poverty worldwide.",
    },
    website: "https://actionforhumanity.org",
    contactEmail: "info@actionforhumanity.org",
    trustees: [
      { id: "afh-1", name: "Othman Moqbel", role: "Chair", appointedDate: "2014-09-01" },
      { id: "afh-2", name: "Sarah Alhaj", role: "Treasurer", appointedDate: "2016-03-15" },
      { id: "afh-3", name: "James Whitfield", role: "Secretary", appointedDate: "2018-11-08" },
      { id: "afh-4", name: "Amira Hassan", role: "Trustee", appointedDate: "2020-01-20" },
      { id: "afh-5", name: "David Okonkwo", role: "Trustee", appointedDate: "2021-06-12" },
      { id: "afh-6", name: "Fatima Rahman", role: "Trustee", appointedDate: "2023-02-28" },
    ],
    informationStatus: buildInformationStatus({
      "safeguarding-policy": {
        status: "present",
        lastUpdated: "2025-01-12",
        notes: "Provided via Impact Engine — requested by a funder",
      },
      "bank-details": { status: "missing", notes: "Not yet verified on platform" },
      "governance-policies": { status: "missing", notes: "No governance policy document on file" },
      "conflict-of-interest": { status: "missing", notes: "Register not submitted" },
      "gdpr-policy": { status: "outdated", lastUpdated: "2021-06-01", notes: "Policy dated 2021 — review overdue" },
      "insurance-certificate": { status: "missing", notes: "No certificate on file" },
      "annual-report": { status: "outdated", lastUpdated: "2022-12-01", notes: "2022 report only" },
    }),
    updateHistory: [
      {
        id: "uh-afh-1",
        date: "2025-01-12",
        title: "Safeguarding policy provided",
        description:
          "Charity uploaded an updated safeguarding policy. Now available to all funders on Impact Engine.",
        requestedBy: { id: "anon-1", displayName: "A funder", isAnonymous: true },
        informationItemId: "safeguarding-policy",
        isShared: true,
      },
      {
        id: "uh-afh-2",
        date: "2025-02-20",
        title: "Governance policies requested",
        description: `${DEMO_FUNDER.name} requested governance policies. Awaiting charity response.`,
        requestedBy: { id: DEMO_FUNDER.id, displayName: DEMO_FUNDER.name, isAnonymous: false },
        informationItemId: "governance-policies",
        isShared: false,
      },
    ],
  },
  "shahid-afridi-foundation": {
    charityCommission: {
      latestIncome: 890_000,
      latestExpenditure: 820_000,
      registeredAddress: "Suite 2, Business Park, Slough, SL1 4DX",
      charitableObjects:
        "To advance education and relieve poverty through sports and community development programmes in the UK and abroad.",
    },
    website: "https://shahidafridifoundation.org",
    contactEmail: null,
  },
  "human-relief-foundation": {
    charityCommission: {
      filingStatus: "Overdue",
      lastAccountsDate: "2023-07-10",
      latestIncome: 3_200_000,
      latestExpenditure: 3_350_000,
    },
    informationStatus: buildInformationStatus({
      "accounts-latest": { status: "outdated", lastUpdated: "2023-07-10", notes: "Accounts overdue with CC" },
      "bank-details": { status: "missing" },
      "insurance-certificate": { status: "missing" },
    }),
  },
  "indigo-volunteers": {
    charityCommission: {
      filingStatus: "Overdue",
      lastAccountsDate: "2023-04-22",
      latestIncome: 180_000,
      latestExpenditure: 320_000,
    },
    informationStatus: buildInformationStatus({
      "accounts-latest": { status: "missing", notes: "Accounts overdue" },
      "safeguarding-policy": { status: "missing", notes: "Policy inadequate or missing" },
      "governance-policies": { status: "outdated", lastUpdated: "2020-01-01", notes: "Not reviewed since 2020" },
      "bank-details": { status: "missing" },
      "insurance-certificate": { status: "missing" },
    }),
  },
}

export function enrichCharity(charity: CharityCore): Charity {
  const override = METADATA_OVERRIDES[charity.slug]
  const latestYear = charity.years.reduce((a, b) => (a.year > b.year ? a : b))
  const trusteeCount = latestYear.governance.numberOfTrustees

  const charityCommission = deriveCharityCommission(charity, override?.charityCommission)
  const trustees = override?.trustees ?? defaultTrustees(trusteeCount, charity.slug)
  const informationStatus =
    override?.informationStatus ??
    buildInformationStatus(
      latestYear.governance.governancePoliciesUpToDate
        ? {}
        : { "governance-policies": { status: "outdated", notes: "Policies not confirmed up to date" } },
    )

  return {
    ...charity,
    charityCommission,
    trustees,
    website: override?.website ?? `https://www.${charity.slug.replace(/-/g, "")}.org.uk`,
    contactEmail: override?.contactEmail ?? `info@${charity.slug.replace(/-/g, "")}.org.uk`,
    informationStatus,
    updateHistory: override?.updateHistory ?? [],
  }
}

export function enrichCharities(charities: CharityCore[]): Charity[] {
  return charities.map(enrichCharity)
}

export function countMissingInformation(informationStatus: InformationItemStatus[]): number {
  return informationStatus.filter((item) => item.status === "missing" || item.status === "outdated").length
}

export { formatCurrency, ccRegisterUrl }
