import { useState } from "react"
import Image from "next/image"
import { Icons } from "@/components/Icons"
import { Layout } from "@/components/Layout"
import { LinkPill } from "@/components/LinkPill"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import ResizablePanel from "@/components/ResizablePanel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGeneratedAnswer } from "@/hooks/use-generated-answer"
import { getContentAndSources } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

export default function LearnPage() {
  const [userQ, setUserQ] = useState("")
  const [submittedQ, setSubmittedQ] = useState("")
  const { loading, answer, trigger } = useGeneratedAnswer()

  const generateAnswer = async (e: any) => {
    e.preventDefault()
    if (!userQ) {
      return toast.error("Please enter a question!")
    }
    try {
      const result = await trigger({ question: userQ }) /* options */
      setSubmittedQ(userQ)
      return result
    } catch (e) {
      return toast.error(e)
    }
  }

  const { content, sources } = getContentAndSources(loading, answer)

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
            <div className="flex justify-center">
              <div className="flex w-full max-w-md items-center space-x-2">
                <Input
                  className="rounded-full px-4 ring-mauve-7"
                  value={userQ}
                  onChange={(e) => setUserQ(e.target.value)}
                  placeholder={"e.g. ?"}
                />
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-24"
                  variant="default"
                  onClick={(e) => generateAnswer(e)}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Ask
                </Button>
              </div>
            </div>

            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{ duration: 2000 }}
            />
            <ResizablePanel>
              <AnimatePresence mode="wait">
                <motion.div className="my-10 space-y-10">
                  {answer && !loading && (
                    <div
                      className={`bg-neutral border-neutral-focus  overflow-x-auto rounded-xl border p-4 shadow-md transition ${"hover:border-accent-focus cursor-copy text-left"}`}
                      onClick={() => {
                        navigator.clipboard.writeText(answer)
                        toast("Copied to clipboard!", {
                          icon: "✂️",
                        })
                      }}
                    >
                      <div>
                        <h2 className="mx-auto text-2xl font-bold tracking-tighter">
                          {submittedQ}
                        </h2>
                      </div>
                      <div className="mt-5 flex items-center gap-2">
                        <Icons.arrowDR className="h-6 w-6 stroke-mint-9" />
                        <p className=" font-mono text-sm font-bold leading-tight tracking-wide text-mint-9">
                          MERCURIAL
                        </p>
                      </div>
                      <div className="mb-3 ">
                        <MarkdownRenderer content={content} />
                      </div>

                      {sources && (
                        <div className="my-2 border-t border-mauve-7">
                          <div className=" my-5 flex gap-2 ">
                            <Icons.link className="h-4 w-4 stroke-mint-9" />

                            <p className=" font-mono text-sm font-bold leading-tight tracking-wide text-mint-9">
                              {`${sources.length} SOURCE${
                                sources.length > 1 ? "S" : ""
                              }`}
                            </p>
                          </div>
                          <div className=" my-5 flex gap-2 ">
                            {sources.map((url, i) => (
                              <LinkPill key={url} order={i} name={url} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
