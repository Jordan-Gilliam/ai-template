import { useState } from "react"
import { ReactNode } from "react"
import type { NextPage } from "next"
import Image from "next/image"
// import LoadingDots from "@/components/LoadingDots"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import ResizablePanel from "@/components/ResizablePanel"
import { Icons } from "@/components/icons"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useGeneratedAnswer } from "@/hooks/use-generated-answer"
import { AnimatePresence, motion } from "framer-motion"
import { Toaster, toast } from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"

export interface PageMeta {
  title: string
  description: string
  cardImage: string
}

interface Props {
  children: ReactNode
  meta?: PageMeta
}

function LinkPill({ order, name }) {
  const cleanName = name.split("SOURCE:")
  const url = new URL(cleanName[1])

  console.log("url", url)

  return (
    <div className="group block max-w-sm cursor-pointer">
      <div className="group flex items-center gap-x-2 divide-x divide-zinc-200 rounded-full border border-zinc-200 bg-transparent px-2 py-4 transition duration-300 dark:divide-zinc-800 dark:border-zinc-800">
        <div className="divide-zinc-200 border-zinc-200 bg-transparent pl-2 transition duration-300 dark:divide-zinc-800 dark:border-zinc-800">
          <div className="font-mono text-xs font-bold uppercase leading-none tracking-widest text-zinc-500 transition duration-300 selection:bg-indigo-8 selection:bg-opacity-70 selection:text-white group-hover:text-indigo-6 dark:selection:bg-opacity-50">
            {order + 1}
          </div>
        </div>
        <div className="pl-3">
          <div className="flex items-center gap-x-1 divide-zinc-200 border-zinc-200 bg-transparent transition duration-300 dark:divide-zinc-800 dark:border-zinc-800">
            <div className="top-one relative">
              <div className="overflow-hidden rounded-full"></div>
            </div>
            <div className="group-hover:text-super default font-sans text-sm text-zinc-800 transition-all duration-300 selection:bg-indigo-8 selection:bg-opacity-70 selection:text-white dark:text-zinc-300 dark:selection:bg-opacity-50">
              {url.hostname}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const DocsPage: NextPage<Props> = ({ children, meta: pageMeta }: Props) => {
  const [userQ, setUserQ] = useState("")
  const { loading, answer, trigger } = useGeneratedAnswer()

  const generateAnswer = async (e: any) => {
    e.preventDefault()
    if (!userQ) {
      return toast.error("Please enter a question!")
    }
    try {
      const result = await trigger({ question: userQ }) /* options */
      return result
    } catch (e) {
      return toast.error(e)
    }
  }

  return (
    <Layout>
      <div className="mx-auto flex min-h-screen flex-col items-center  py-2">
        <main className="mx-auto  flex min-h-screen w-full flex-1 flex-col items-center  px-4 py-2 text-center sm:mt-20">
          <h1 className="mb-6 max-w-xl text-2xl font-bold sm:text-4xl">
            Ask me anything
          </h1>
          <p className="mb-6 -mt-4 max-w-xl text-lg text-mauve-11">
            This chat leverages the embedded knowledge provided by you
          </p>
          <div className="w-full max-w-4xl">
            <Textarea
              className=" h-[150px] w-full border-2 border-mauve-9 shadow-sm placeholder:text-mauve-11"
              value={userQ}
              onChange={(e) => setUserQ(e.target.value)}
              rows={4}
              placeholder={"e.g. ?"}
            />

            {!loading && userQ && (
              <Button
                variant="default"
                className=" mt-8 w-64 px-4 py-2 font-semibold"
                onClick={(e) => generateAnswer(e)}
              >
                Ask your question &rarr;
              </Button>
            )}
            {loading && (
              <Button className=" mt-2 w-full px-4 py-2 font-medium" disabled>
                {/* <LoadingDots color="white" style="xl" /> */}
              </Button>
            )}
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{ duration: 2000 }}
            />
            <ResizablePanel>
              <AnimatePresence mode="wait">
                <motion.div className="my-10 space-y-10">
                  {answer && !loading && (
                    <>
                      <div>
                        <h2 className="mx-auto text-3xl font-bold sm:text-4xl">
                          Here is your answer:{" "}
                        </h2>
                      </div>
                      {answer.split("SOURCES:").map((splitanswer, index) => {
                        const sources = splitanswer
                          .trim()
                          .split("\n")
                          .filter((url) => url.trim().length > 0)

                        const [answer, sourceList] = sources

                        const splitSourceList = sourceList
                          .trim()
                          .split("\n")
                          .filter((url) => url.trim().length > 0)

                        return (
                          <div
                            className={`bg-neutral border-neutral-focus  overflow-x-auto rounded-xl border p-4 shadow-md transition ${
                              index === 0
                                ? "hover:border-accent-focus cursor-copy text-left"
                                : ""
                            }`}
                            onClick={() => {
                              if (index === 0) {
                                navigator.clipboard.writeText(splitanswer)
                                toast("Copied to clipboard!", {
                                  icon: "✂️",
                                })
                              }
                            }}
                            key={index}
                          >
                            <MarkdownRenderer content={answer} />

                            <div className=" my-5 flex gap-2  divide-y-4">
                              <Icons.link className="h-4 w-4 stroke-indigo-9" />

                              <p className=" font-mono text-sm font-bold leading-tight tracking-wide text-indigo-9">
                                {`${splitSourceList.length} SOURCE${
                                  splitSourceList.length > 1 ? "S" : ""
                                }`}
                              </p>
                            </div>

                            {splitSourceList.map((url, i) => (
                              <LinkPill order={i} name={url} />
                            ))}
                          </div>
                        )
                      })}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </ResizablePanel>
            <div className="mt-8 flex items-center justify-center">
              <Image
                className=" rotate-[180deg]"
                height={150}
                width={250}
                src="/logo-down-pink.svg"
                alt="logo"
              />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default DocsPage
