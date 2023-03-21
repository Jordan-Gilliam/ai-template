import type { AppProps } from "next/app"
// import { Inter as FontSans } from "@next/font/google"
import { Work_Sans as FontSans } from "@next/font/google"
import { Aboreto } from "@next/font/google"
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
      <style jsx global>{`
				:root {
					--font-sans: ${fontSans.style.fontFamily};
          --font-aboreto: ${fontAboretoSans.style.fontFamily}
				}
			}`}</style>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
