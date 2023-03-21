import { NavItem } from "@/types/nav"

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
      title: "Chat",
      href: "/chat",
    },
    {
      title: "Domain Specific",
      href: "/embed",
    },
  ],
  links: {
    twitter: "https://twitter.com/nolansym",
    github: "https://github.com/Jordan-Gilliam/ai-template",
  },
}
