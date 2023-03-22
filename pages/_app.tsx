import type { AppProps } from "next/app"
import { Work_Sans as FontSans } from "@next/font/google"
import { Aboreto } from "@next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "next-themes"
import "@/styles/globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontAboretoSans = Aboreto({ weight: "400", variable: "--font-aboreto" })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main
          className={`${fontAboretoSans.variable} ${fontSans.variable} font-sans `}
        >
          <Component {...pageProps} />
          <Analytics />
        </main>
      </ThemeProvider>
    </>
  )
}
