import React from "react"
import Head from "next/head"
import Image from "next/image"
import { Icons } from "@/components/icons"
import { Layout } from "@/components/layout"

export default function IndexPage() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <Layout>
      <Head>
        <title>Mercury</title>
        <meta
          name="description"
          content="Unlock the secrets of any website with Mercury, the alchemical tool that transmutes information into understanding."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <Image
            className=" rotate-[36deg] hover:rotate-180"
            height={250}
            width={250}
            src="/logo-up.svg"
            alt="logo"
          />
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Mercury <br className="inline" />
            <span className="text-xl md:text-5xl lg:text-6xl">
              Unlock the secrets of any website
            </span>
          </h1>
          <p className="max-w-[700px] text-lg text-zinc-700 dark:text-zinc-400 sm:text-xl">
            transmute information into understanding.
          </p>
        </div>
        <p className="hidden text-2xl text-zinc-500 dark:text-zinc-400 md:block">
          <kbd className="pointer-events-none inline-flex h-12 select-none items-center gap-1 rounded border border-zinc-100 bg-zinc-800 px-4 font-mono text-[32px] font-medium text-zinc-300 opacity-100 dark:border-zinc-700 dark:bg-zinc-200 dark:text-zinc-900">
            <span className="text-5xl">⌘</span>K
          </kbd>
        </p>
      </section>
      <div className="ml-20 flex items-center justify-center md:gap-20">
        <Icons.mercury className="     fill-[#FEE9DF] dark:fill-mauve-1 dark:stroke-sky-9" />
        <Icons.mercury className=" fill-mauve-12  stroke-violet-12 dark:fill-transparent" />
        <Icons.mercury className="  fill-[#e1fbf4] dark:fill-mauve-1 dark:stroke-orange-9" />
      </div>
      {/* <Icons.mercury className="absolute left-80  stroke-plum-6" />
        <Icons.mercury className="absolute right-80  stroke-plum-6" />
        <Icons.mercury className="absolute right-20  stroke-plum-6" /> */}
      {/* <Image
        className=" absolute right-20  fill-orange-400 hover:rotate-180"
        height={100}
        width={100}
        src="/mercury.svg"
        alt="logo"
      /> */}
    </Layout>
  )
}
