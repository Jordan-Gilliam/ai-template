import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn, getContentAndSources, pluralize } from "@/lib/utils"
import { LinkPill } from "@/components/LinkPill"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import ResizablePanel from "@/components/ResizablePanel"
import { SearchInput } from "@/components/SearchInput"
import { Icons } from "@/components/icons"
import { useGetEmbeddings } from "@/hooks/use-get-embeddings"
import { toast } from "@/hooks/use-toast"

export function InvokeEmbeddings() {
  const [userQ, setUserQ] = useState("")
  const [submittedQ, setSubmittedQ] = useState("")
  const [status, setStatus] = useState("idle")

  const { loading, answer, trigger, error } = useGetEmbeddings()

  const generateAnswer = async (e: any) => {
    e.preventDefault()
    if (!userQ) {
      return toast({
        title: "Please enter a url",
      })
    }

    try {
      setSubmittedQ(userQ)
      const result = await trigger({ question: userQ })
      setStatus("complete")
      return result
    } catch (e) {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: e,
      })
    }
  }

  const { content, sources } = getContentAndSources(loading, answer)

  function handleChange(e) {
    setStatus("typing")
    return setUserQ(e.target.value)
  }

  function handleSubmit(e) {
    setUserQ("")
    return generateAnswer(e)
  }

  return (
    <div className="flex flex-col items-center py-2">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center">
          <SearchInput
            value={userQ}
            handleChange={handleChange}
            loading={loading}
            handleClick={handleSubmit}
            status={status}
            placeholder="What are React Server Components?"
          />
        </div>
        <ResizablePanel>
          {submittedQ ? (
            <AnimatePresence mode="wait">
              <motion.div className="my-10 space-y-10">
                <div
                  className={cn(
                    "bg-neutral border-neutral-focus  overflow-x-auto rounded-xl border p-4 shadow-md",
                    "hover:border-accent-focus cursor-copy text-left transition",
                    loading ? "animate-pulse" : ""
                  )}
                  onClick={() => {
                    navigator.clipboard.writeText(answer)
                  }}
                >
                  <Answer
                    submittedQ={submittedQ}
                    content={content}
                    error={error}
                  />
                  <Sources sources={sources} />
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </ResizablePanel>
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

function Answer({ submittedQ, content, error }) {
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
        {!error && content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <LoadingLine />
        )}
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
      <motion.ul layout className=" my-5 flex gap-2 ">
        {sources.map((url, i) => (
          <LinkPill key={`${url}-${i}`} order={i} name={url} />
        ))}
      </motion.ul>
    </div>
  )
}

export function LoadingLine() {
  return (
    <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
      <div className="flex grow space-x-3">
        <div className="min-w-0 flex-1">
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-mauve-4"></div>
              <div className="col-span-1 h-2 rounded bg-mauve-4"></div>
            </div>
            <div className="h-2 rounded bg-mauve-4"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
