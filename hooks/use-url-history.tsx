"use-client"

import { useEffect, useState } from "react"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

interface UrlHistoryItem {
  id: number
  url: string
}

interface UrlStore {
  urlHistory: UrlHistoryItem[]
  nextId: number
  addUrlToHistory: (payload: string) => void
}

const emptyState = {
  urlHistory: [],
  nextId: 1,
  addUrlToHistory: () => {
    return
  },
}

export const useUrlHistory = create<UrlStore>()(
  persist(
    immer((set) => ({
      urlHistory: [],
      nextId: 1,
      addUrlToHistory: (payload: string) =>
        set((state) => {
          state.urlHistory.push({
            id: state.nextId,
            url: payload,
          })
          state.nextId += 1
        }),
    })),
    {
      name: "merc-local-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  return hasHydrated
}
