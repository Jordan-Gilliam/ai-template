'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { AnimatedTabs } from '@/components/animated-tabs'
import { useTabs } from '@/components/tabs/tab-context'

export function StaticNav() {
  const { tabs, activeTab, setActiveTab } = useTabs()
  return (
    <AnimatedTabs
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={tabs}
    />
  )
}
