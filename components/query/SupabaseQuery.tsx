import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn, getContentAndSources } from "@/lib/utils"
import { Answer, Sources } from "@/components/Perplexity"
import ResizablePanel from "@/components/ResizablePanel"
import { SearchInput } from "@/components/SearchInput"
import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { toast } from "@/hooks/use-toast"

export function SupabaseQuery() {
  const [userQ, setUserQ] = useState("")
  const [submittedQ, setSubmittedQ] = useState("")
  const [status, setStatus] = useState("idle")

  const { loading, answer, trigger, error } = useSupabaseQuery()

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
            placeholder="Query Embeddings"
          />
        </div>
        <ResizablePanel>
          {submittedQ ? (
            <AnimatePresence mode="wait">
              <motion.div className="my-10 space-y-10">
                <div
                  className={cn(
                    "bg-neutral border-neutral-focus overflow-x-auto rounded-xl border p-4 shadow-md",
                    "hover:border-accent-focus text-left transition",
                    loading ? "animate-pulse" : ""
                  )}
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
