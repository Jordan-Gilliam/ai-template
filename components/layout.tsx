import * as React from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Icons } from "@/components/Icons"
import { NavHeader } from "@/components/NavHeader"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavHeader />
      <main>{children}</main>
    </>
  )
}

export function Logo({ path, width, height, rotate = false }) {
  return (
    <div className="mt-8 flex items-center justify-center">
      <Image
        className={`${rotate ? "rotate-[180deg]" : ""}`}
        height={height}
        width={width}
        src={path}
        alt="logo"
      />
    </div>
  )
}

export function FancyBackground({ children }) {
  return (
    <div className="relative z-0 min-h-screen">
      <div className="absolute inset-0 -z-10 overflow-hidden ">
        <div className=" fancy-bg2 absolute top-0 bottom-0 left-1/2 w-[100vw] min-w-[1500px] -translate-x-1/2 bg-no-repeat" />
      </div>
      {children}
    </div>
  )
}

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icons.sun className="rotate-0 scale-100 transition-all hover:text-zinc-900 dark:-rotate-90 dark:scale-0 dark:text-zinc-400 dark:hover:text-zinc-100" />
          <Icons.moon className="absolute rotate-90 scale-0 transition-all hover:text-zinc-900 dark:rotate-0 dark:scale-100 dark:text-zinc-400 dark:hover:text-zinc-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Icons.sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Icons.moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Icons.laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
