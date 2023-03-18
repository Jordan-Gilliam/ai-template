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
  description: "AI Wizard Creator",
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
      title: "Embed",
      href: "/embeddings",
    },
    {
      title: "Learn",
      href: "/learn",
    },
  ],
  links: {
    twitter: "https://twitter.com/nolansym",
    github: "https://github.com/Jordan-Gilliam/mercury",
  },
}
