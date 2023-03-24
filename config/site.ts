import { NavItem } from "@/types"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Mercury",
  description: "Unlock the secrets of any website",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Scrape",
      href: "/scrape",
    },
    {
      title: "File",
      href: "/file",
    },
    {
      title: "Chat",
      href: "/chat",
    },
  ],
  links: {
    twitter: "https://twitter.com/nolansym",
    github: "https://github.com/Jordan-Gilliam/ai-template",
  },
}
