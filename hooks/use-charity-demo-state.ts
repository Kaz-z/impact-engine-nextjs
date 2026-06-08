"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { Charity, InformationItemStatus, UpdateHistoryEntry } from "@/lib/types"
import {
  loadDemoStorage,
  mergeInformationStatus,
  mergeUpdateHistory,
  saveDemoStorage,
  simulateCharityResponse,
  submitUpdateRequest,
  type CharityDemoStorage,
  type SimulateResponseOptions,
} from "@/lib/demo-storage"
import {
  evaluateFunderRequirements,
  summarizeInformationStatus,
} from "@/lib/evaluate-requirements"

export function useCharityDemoState(baseCharity: Charity) {
  const [storage, setStorage] = useState<CharityDemoStorage | null>(null)
  const [requestSuccess, setRequestSuccess] = useState(false)

  useEffect(() => {
    setStorage(loadDemoStorage(baseCharity.id))
  }, [baseCharity.id])

  const charity = useMemo((): Charity => {
    if (!storage) return baseCharity
    return {
      ...baseCharity,
      informationStatus: mergeInformationStatus(
        baseCharity.informationStatus,
        storage.informationOverrides,
      ),
      updateHistory: mergeUpdateHistory(baseCharity.updateHistory, storage.extraHistory),
    }
  }, [baseCharity, storage])

  const persist = useCallback(
    (next: CharityDemoStorage) => {
      setStorage(next)
      saveDemoStorage(baseCharity.id, next)
    },
    [baseCharity.id],
  )

  const sendUpdateRequest = useCallback(
    (itemIds: string[], message?: string) => {
      const current = storage ?? loadDemoStorage(baseCharity.id)
      const next = submitUpdateRequest(
        current,
        baseCharity.id,
        baseCharity.name,
        itemIds,
        message,
      )
      persist(next)
      setRequestSuccess(true)
      setTimeout(() => setRequestSuccess(false), 4000)
    },
    [baseCharity, storage, persist],
  )

  const simulateResponse = useCallback(
    (requestId: string, options: SimulateResponseOptions) => {
      const current = storage ?? loadDemoStorage(baseCharity.id)
      const next = simulateCharityResponse(current, baseCharity.name, requestId, options)
      if (next) persist(next)
    },
    [baseCharity.name, storage, persist],
  )

  const getInformationStatus = useCallback((): InformationItemStatus[] => {
    return charity.informationStatus
  }, [charity.informationStatus])

  const getUpdateHistory = useCallback((): UpdateHistoryEntry[] => {
    return charity.updateHistory
  }, [charity.updateHistory])

  const informationSummary = useMemo(
    () => summarizeInformationStatus(charity),
    [charity],
  )

  const getDueDiligenceSummary = useCallback(
    (yearData: Charity["years"][number]) => evaluateFunderRequirements(charity, yearData),
    [charity],
  )

  const pendingRequests = storage?.updateRequests.filter(
    (r) => r.status === "sent" || r.status === "partially_fulfilled",
  ) ?? []

  const isReady = storage !== null

  return {
    charity,
    isReady,
    informationSummary,
    getDueDiligenceSummary,
    sendUpdateRequest,
    simulateResponse,
    pendingRequests,
    requestSuccess,
    getInformationStatus,
    getUpdateHistory,
  }
}
