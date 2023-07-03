'use client'

import React, { createContext, useContext, useState } from 'react'

// Define the type for the tab object
interface Tab {
  id: string
  label: string
}

// Define the type for the context value
interface TabsContextValue {
  tabs: Tab[]
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

// Create the context
const TabsContext = createContext<TabsContextValue | undefined>(undefined)

// Create a custom provider component for the context
export const TabsProvider: React.FC = ({ children }) => {
  const tabs: Tab[] = [
    { id: 'chat', label: 'Chat' },
    { id: 'documents', label: 'Documents' },
    { id: 'completion', label: 'Completion' }
  ]

  const [activeTab, setActiveTab] = useState(tabs[0].id)

  const value: TabsContextValue = {
    tabs,
    activeTab,
    setActiveTab
  }

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}

// Custom hook to access the tabs context
export const useTabs = (): TabsContextValue => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider')
  }
  return context
}
