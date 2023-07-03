'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { TooltipProvider } from '@/components/ui/tooltip'
import { TabsProvider } from '@/components/tabs/tab-context'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TabsProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </TabsProvider>
    </NextThemesProvider>
  )
}
