import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PlusIcon } from "lucide-react"
import { Loader2 } from "lucide-react"
import { cn, getContentAndSources, pluralize } from "@/lib/utils"
import { LinkPill } from "@/components/LinkPill"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import ResizablePanel from "@/components/ResizablePanel"
import { Icons } from "@/components/icons"
import { InputButton } from "@/components/ui/input"
import { useGetEmbeddings } from "@/hooks/use-get-embeddings"
import { toast } from "@/hooks/use-toast"

export function InvokeEmbeddings() {
  const [userQ, setUserQ] = useState("")
  const [submittedQ, setSubmittedQ] = useState("")
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
      return result
    } catch (e) {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: e,
      })
    }
  }

  const { content, sources } = getContentAndSources(loading, answer)

  return (
    // <div className="mx-auto flex min-h-screen flex-col items-center  py-2">
    <div className="flex flex-col items-center py-2">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center">
          <div className="flex w-full max-w-lg items-center space-x-2">
            {/* <Input
              className="rounded-full px-4 ring-mauve-7"
              value={userQ}
              onChange={(e) => setUserQ(e.target.value)}
              placeholder={"e.g. Teach me about Manly P Hall"}
            /> */}
            {/* <div className=" min-w-[350px] md:min-w-[500px] lg:min-w-[550px]"> */}
            <InputButton
              // className=" relative rounded-full py-8 pr-16   ring-2 ring-teal-800/20"
              className=" relative rounded-full py-8 pr-16   ring-2 dark:ring-teal-900/20"
              value={userQ}
              onChange={(e) => setUserQ(e.target.value)}
              placeholder={"e.g. Teach me about Manly P Hall"}
            >
              <div className="relative -ml-10 flex items-center justify-center">
                <div className="absolute  ml-4 w-14 rounded-r-full    ">
                  <button
                    disabled={loading}
                    type="submit"
                    onClick={(e) => generateAnswer(e)}
                    className=" group z-10  -ml-px  inline-flex items-center rounded-full bg-mauve-1  px-3 py-3 text-sm font-semibold text-mauve-12 shadow-sm ring-1 ring-inset ring-mauve-9 hover:ring-indigo-10 focus:outline-none focus:ring-indigo-10 dark:hover:ring-mint-10 dark:focus:ring-mint-10 "
                  >
                    {loading ? (
                      <Loader2 className="-ml-0.5 h-7 w-7 animate-spin text-indigo-9 group-hover:text-indigo-9 dark:text-mint-10 dark:group-hover:text-mint-9" />
                    ) : (
                      <PlusIcon
                        className="-ml-0.5 h-7 w-7 text-indigo-9 group-hover:text-indigo-9 dark:text-mint-10 dark:group-hover:text-mint-9"
                        aria-hidden="true"
                      />
                    )}
                    {/* <span className="pr-1 group-hover:text-indigo-9 dark:group-hover:text-mint-9">
                  Invoke
                </span> */}
                  </button>
                </div>
              </div>
            </InputButton>
            {/* </div> */}
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
                  // toast({"Copied to clipboard!", {
                  //   icon: "✂️",
                  // })
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
        {!error && content ? <MarkdownRenderer content={content} /> : null}
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
