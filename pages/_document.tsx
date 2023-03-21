import { Head, Html, Main, NextScript } from "next/document"
import { FancyBackground } from "@/components/Layout"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="min-h-screen  font-sans text-zinc-900 antialiased  dark:text-zinc-50">
        <FancyBackground>
          <Main />
          <NextScript />
        </FancyBackground>
      </body>
    </Html>
  )
}
