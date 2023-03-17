<h1 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc1.png" alt=""></a>
</h1>

<h4 align="center">mercury</h4>

<h2 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc2.png" alt=""></a>
</h2>

<h2 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc3.png" alt=""></a>
</h2>

A Next.js 13 template for building apps with Radix UI and Tailwind CSS.

## Features

- Radix UI Primitives
- Tailwind CSS
- Fonts with `@next/font`
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Automatic import sorting with `@ianvs/prettier-plugin-sort-imports`

## Tailwind CSS Features

- Class merging with `taiwind-merge`
- Animation with `tailwindcss-animate`
- Conditional classes with `clsx`
- Variants with `class-variance-authority`
- Automatic class sorting with `eslint-plugin-tailwindcss`

## Import Sort

The starter comes with `@ianvs/prettier-plugin-sort-imports` for automatically sort your imports.

### Input

```tsx
import * as React from "react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { NavItem } from "@/types/nav"
import { twMerge } from "tailwind-merge"
```

### Output

```tsx
import * as React from "react"
// React is always first.
import Link from "next/link"
// lib
import { buttonVariants } from "@/components/ui/button"
// types
import { siteConfig } from "@/config/site"
// config
import { cn } from "@/lib/utils"
// Followed by third-party modules
// Space
import "@/styles/globals.css"
// styles
import { NavItem } from "@/types/nav"
// Followed by next modules.
import { twMerge } from "tailwind-merge"

// components
```

### Class Merging

The `cn` util handles conditional classes and class merging.

### Input

```ts
cn("px-2 bg-zinc-100 py-2 bg-zinc-200")
// Outputs `p-2 bg-zinc-200`
```

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).
