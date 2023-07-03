'use client'

import * as React from 'react'
import { Settings } from 'lucide-react'

import Link from 'next/link'
import Image from 'next/image'

import { Twitter } from 'lucide-react'

import { SidebarFooter } from '@/components/sidebar-footer'

import { siteConfig } from '@/config/site'

import { ThemeToggle } from '@/components/patterns'

import { Button } from '@/components/ui/button'

import { IconSidebar } from '@/components/ui/icons'

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import { FancyBackground } from '@/components/patterns'

export interface SidebarProps {
  children?: React.ReactNode
}

export function SidebarSettings({ children }: SidebarProps) {
  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 h-9 w-9 p-0">
          <Settings className="text-muted-foreground" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="inset-y-0 flex h-auto w-full  flex-col p-0 bg-black backdrop-blur-none"
      >
        <SheetHeader className="p-4 ">
          <Link href="/" className=" flex items-center space-x-2">
            <div className="md:h-13 relative h-8 w-10">
              <Image fill className="absolute" src="/logo-og.svg" alt="logo" />
            </div>
            <span className="hidden font-aboreto font-bold sm:inline-block">
              {siteConfig.name}
            </span>
          </Link>

          {/* <SheetTitle className="text-sm">Settings</SheetTitle> */}
        </SheetHeader>

        {children}
      </SheetContent>
    </Sheet>
  )
}
