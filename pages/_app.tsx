import type { AppProps } from "next/app"
import { Aboreto, Work_Sans as FontSans, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "next-themes"
import { SWRConfig } from "swr"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"
import "@/styles/globals.css"

const fontSans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

const fontAboretoSans = Aboreto({
  weight: "400",
  subsets: ["latin"],
  preload: true,
  variable: "--font-aboreto",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${fontSans.style.fontFamily};
          --font-aboreto: ${fontAboretoSans.style.fontFamily};
        }
      `}</style>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          onError: (error, key) => {
            toast({ title: "API Error", description: error.message })
          },
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Component {...pageProps} />
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </SWRConfig>
    </>
  )
}
