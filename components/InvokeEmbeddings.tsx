import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import { cn, getContentAndSources, pluralize } from "@/lib/utils"
import { Icons } from "@/components/Icons"
import { LinkPill } from "@/components/LinkPill"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import ResizablePanel from "@/components/ResizablePanel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetEmbeddings } from "@/hooks/use-get-embeddings"

export function InvokeEmbeddings() {
  const [userQ, setUserQ] = useState("")
  const [submittedQ, setSubmittedQ] = useState("")
  const { loading, answer, trigger } = useGetEmbeddings()

  const generateAnswer = async (e: any) => {
    e.preventDefault()
    if (!userQ) {
      return toast.error("Please enter a question!")
    }
    try {
      setSubmittedQ(userQ)
      const result = await trigger({ question: userQ })
      return result
    } catch (e) {
      return toast.error(e)
    }
  }

  const { content, sources } = getContentAndSources(loading, answer)

  return (
    // <div className="mx-auto flex min-h-screen flex-col items-center  py-2">
    <div className="flex flex-col items-center py-2">
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
              className="w-24 "
              variant="default"
              onClick={(e) => generateAnswer(e)}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Invoke
            </Button>
          </div>
        </div>

        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="my-10 space-y-10">
              <div
                className={cn(
                  `bg-neutral border-neutral-focus  overflow-x-auto rounded-xl border p-4 shadow-md transition 
                      ${"hover:border-accent-focus cursor-copy text-left"}`,
                  loading ? "animate-pulse" : ""
                )}
                onClick={() => {
                  navigator.clipboard.writeText(answer)
                  toast("Copied to clipboard!", {
                    icon: "✂️",
                  })
                }}
              >
                <Answer submittedQ={submittedQ} content={content} />
                <Sources sources={sources} />
              </div>
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
      </div>
    </div>
  )
}

const AnimatedQuestion = ({ submittedQ }) => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 3.5 } },
    exit: { opacity: 0, transition: { duration: 0.02 } },
  }

  return (
    <AnimatePresence>
      {submittedQ && (
        <motion.h2
          key={submittedQ}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeIn}
          className="mx-auto text-2xl font-bold tracking-tighter"
        >
          {submittedQ}
        </motion.h2>
      )}
    </AnimatePresence>
  )
}

function Answer({ submittedQ, content }) {
  return (
    <>
      <AnimatedQuestion submittedQ={submittedQ} />
      <div className="mt-5 flex items-center gap-2">
        <Icons.arrowDR className="h-6 w-6 stroke-indigo-10 dark:stroke-mint-9" />
        <p className=" font-aboreto text-sm font-bold leading-tight tracking-wide text-indigo-10 dark:text-mint-9">
          MERCURIAL
        </p>
      </div>
      <div className="mb-3 ">
        {content ? <MarkdownRenderer content={content} /> : null}
      </div>
    </>
  )
}

function Sources({ sources }) {
  if (!sources) return null
  return (
    <div className="my-2 border-t border-mauve-7">
      <div className=" my-5 flex gap-2 ">
        <Icons.link className="h-4 w-4  stroke-indigo-10 dark:stroke-mint-9" />

        <p className=" font-aboreto text-sm font-bold leading-tight tracking-wide text-indigo-10 dark:text-mint-9">
          {`${sources.length} ${pluralize("SOURCE", sources.length)}`}
        </p>
      </div>
      <motion.ul className=" my-5 flex gap-2 ">
        {sources.map((url, i) => (
          <LinkPill key={`${url}-${i}`} order={i} name={url} />
        ))}
      </motion.ul>
    </div>
  )
}
