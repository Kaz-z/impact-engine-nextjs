import type {
  InformationItemStatus,
  UpdateHistoryEntry,
  UpdateRequest,
} from "./types"
import { REQUIRED_INFORMATION_BY_ID } from "./required-information"
import { DEMO_FUNDER } from "./funder-requirements"

export interface CharityDemoStorage {
  informationOverrides: Record<string, InformationItemStatus>
  extraHistory: UpdateHistoryEntry[]
  updateRequests: UpdateRequest[]
}

function storageKey(charityId: string): string {
  return `impact-engine-charity-demo-${charityId}`
}

export function emptyDemoStorage(): CharityDemoStorage {
  return {
    informationOverrides: {},
    extraHistory: [],
    updateRequests: [],
  }
}

export function loadDemoStorage(charityId: string): CharityDemoStorage {
  if (typeof window === "undefined") return emptyDemoStorage()
  try {
    const raw = localStorage.getItem(storageKey(charityId))
    if (!raw) return emptyDemoStorage()
    return { ...emptyDemoStorage(), ...JSON.parse(raw) }
  } catch {
    return emptyDemoStorage()
  }
}

export function saveDemoStorage(charityId: string, storage: CharityDemoStorage): void {
  if (typeof window === "undefined") return
  localStorage.setItem(storageKey(charityId), JSON.stringify(storage))
}

export function mergeInformationStatus(
  base: InformationItemStatus[],
  overrides: Record<string, InformationItemStatus>,
): InformationItemStatus[] {
  return base.map((item) => overrides[item.itemId] ?? item)
}

export function mergeUpdateHistory(
  base: UpdateHistoryEntry[],
  extra: UpdateHistoryEntry[],
): UpdateHistoryEntry[] {
  return [...extra, ...base].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function getGapItemIds(informationStatus: InformationItemStatus[]): string[] {
  return informationStatus
    .filter((item) => item.status === "missing" || item.status === "outdated")
    .map((item) => item.itemId)
}

export function submitUpdateRequest(
  storage: CharityDemoStorage,
  charityId: string,
  charityName: string,
  itemIds: string[],
  message?: string,
): CharityDemoStorage {
  const now = new Date().toISOString()
  const date = now.split("T")[0]
  const requestId = `req-${Date.now()}`

  const request: UpdateRequest = {
    id: requestId,
    charityId,
    requestedBy: {
      id: DEMO_FUNDER.id,
      displayName: DEMO_FUNDER.name,
      isAnonymous: false,
    },
    requestedAt: now,
    message,
    items: itemIds.map((id) => ({
      informationItemId: id,
      status: "requested" as const,
    })),
    status: "sent",
  }

  const itemLabels = itemIds
    .map((id) => REQUIRED_INFORMATION_BY_ID[id]?.label ?? id)
    .join(", ")

  const historyEntry: UpdateHistoryEntry = {
    id: `uh-${requestId}`,
    date,
    title: "Update request sent",
    description: `${DEMO_FUNDER.name} requested: ${itemLabels}.${message ? ` Message: "${message}"` : ""}`,
    requestedBy: request.requestedBy,
    isShared: false,
  }

  return {
    ...storage,
    updateRequests: [request, ...storage.updateRequests],
    extraHistory: [historyEntry, ...storage.extraHistory],
  }
}

export interface SimulateResponseOptions {
  shareWithPlatform: boolean
  showFunderName: boolean
}

export function simulateCharityResponse(
  storage: CharityDemoStorage,
  charityName: string,
  requestId: string,
  options: SimulateResponseOptions,
): CharityDemoStorage | null {
  const requestIndex = storage.updateRequests.findIndex((r) => r.id === requestId)
  if (requestIndex === -1) return null

  const request = storage.updateRequests[requestIndex]
  const pendingItem = request.items.find((item) => item.status === "requested")
  if (!pendingItem) return null

  const now = new Date().toISOString()
  const date = now.split("T")[0]
  const itemLabel =
    REQUIRED_INFORMATION_BY_ID[pendingItem.informationItemId]?.label ??
    pendingItem.informationItemId

  const updatedItems = request.items.map((item) =>
    item.informationItemId === pendingItem.informationItemId
      ? {
          ...item,
          status: "provided" as const,
          providedAt: now,
          documentLabel: `${itemLabel}.pdf`,
        }
      : item,
  )

  const allProvided = updatedItems.every(
    (item) => item.status === "provided" || item.status === "declined",
  )

  const updatedRequest: UpdateRequest = {
    ...request,
    items: updatedItems,
    status: allProvided ? "fulfilled" : "partially_fulfilled",
  }

  const informationOverrides = {
    ...storage.informationOverrides,
    [pendingItem.informationItemId]: {
      itemId: pendingItem.informationItemId,
      status: "present" as const,
      lastUpdated: date,
      documentUrl: null,
      notes: options.shareWithPlatform
        ? "Provided via Impact Engine — now available to all funders"
        : "Provided via Impact Engine",
    },
  }

  const funderDisplay = options.showFunderName
    ? DEMO_FUNDER.name
    : "A funder"

  const historyEntry: UpdateHistoryEntry = {
    id: `uh-provided-${Date.now()}`,
    date,
    title: `${itemLabel} provided`,
    description: options.shareWithPlatform
      ? `Charity uploaded ${itemLabel.toLowerCase()}. Now available to all funders on Impact Engine.`
      : `${itemLabel} uploaded by ${charityName}. Shared with permission from charity.`,
    requestedBy: {
      id: options.showFunderName ? DEMO_FUNDER.id : "anon-responder",
      displayName: funderDisplay,
      isAnonymous: !options.showFunderName,
    },
    informationItemId: pendingItem.informationItemId,
    isShared: options.shareWithPlatform,
  }

  const updatedRequests = [...storage.updateRequests]
  updatedRequests[requestIndex] = updatedRequest

  return {
    ...storage,
    informationOverrides,
    updateRequests: updatedRequests,
    extraHistory: [historyEntry, ...storage.extraHistory],
  }
}

export function getPendingRequests(storage: CharityDemoStorage): UpdateRequest[] {
  return storage.updateRequests.filter(
    (r) => r.status === "sent" || r.status === "partially_fulfilled",
  )
}
