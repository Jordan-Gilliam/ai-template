import * as React from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { NavHeader } from "@/components/NavHeader"
import { Icons } from "@/components/icons"
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

function PageLayout({ children }: LayoutProps) {
  return (
    <>
      <NavHeader />
      <div>{children}</div>
    </>
  )
}

function Logo({ path, width, height, rotate = false }) {
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

function FancyBackground({ children }) {
  return (
    <div className="relative z-0 min-h-screen">
      <div className="absolute inset-0 -z-10 overflow-hidden ">
        <div className=" fancy-bg2  absolute inset-y-0 left-1/2 w-[100vw] min-w-[1500px] -translate-x-1/2 bg-no-repeat" />
      </div>
      {children}
    </div>
  )
}

function BackgroundGridPattern() {
  return (
    <svg
      className="absolute inset-0 -z-10 h-full w-full stroke-neutral-500/50 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
          width={200}
          height={200}
          x="50%"
          y={-1}
          patternUnits="userSpaceOnUse"
        >
          <path d="M100 200V.5M.5 .5H200" fill="none" />
        </pattern>
      </defs>
      <svg
        x="50%"
        y={-1}
        className="overflow-visible fill-neutral-200/30 dark:fill-neutral-800/30"
      >
        <path
          d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
          strokeWidth={0}
        />
      </svg>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
      />
    </svg>
  )
}

function BackgroundColorBlur() {
  return (
    <div
      className="fixed -z-10 hidden md:bottom-1 md:right-[50rem] md:block md:transform-gpu md:blur-3xl"
      aria-hidden="true"
    >
      <div
        className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-[#46ffdd] to-[#776fff] opacity-25"
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />
    </div>
  )
}

function ThemeToggle() {
  let { theme, setTheme } = useTheme()

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

export {
  PageLayout,
  Logo,
  FancyBackground,
  ThemeToggle,
  BackgroundGridPattern,
  BackgroundColorBlur,
}
