import { useState } from "react"
import { LayoutGroup, motion } from "framer-motion"
import { pluralize } from "@/lib/utils"
import { LinkPill } from "@/components/LinkPill"
import { SearchInput } from "@/components/SearchInput"
import { Icons } from "@/components/icons"
import { useGenerateEmbeddings } from "@/hooks/use-generate-embeddings"
import { toast } from "@/hooks/use-toast"
import { useHasHydrated, useUrlHistory } from "@/hooks/use-url-history"

export function EvokeEmbeddings() {
  const [urls, setUrls] = useState<string[]>([])
  const [status, setStatus] = useState("idle")

  const isHydrated = useHasHydrated()
  const { urlHistory, addUrlToHistory } = useUrlHistory()

  const { loading, trigger } = useGenerateEmbeddings()

  function handleChange(e) {
    setStatus("typing")
    return setUrls(e.target.value.split("\n"))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!urls) {
      return toast({
        title: "Please enter a url",
      })
    }
    try {
      const result = await trigger({ urls })
      setStatus("complete")
      urls.map((url) => addUrlToHistory(url))

      return result
    } catch (e) {
      setStatus("error")
      return toast({
        title: "Uh oh! Something went wrong.",
        description: e,
      })
    }
  }

  const sortedUrls = isHydrated
    ? [...urlHistory].sort((a, b) => a.id - b.id)
    : []

  return (
    <div className="flex flex-col items-center py-2">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center">
          <SearchInput
            placeholder="https://react.dev/"
            value={urls.join("\n")}
            status={status}
            handleChange={handleChange}
            loading={loading}
            handleClick={handleSubmit}
          />

          <div className="mt-4 w-full max-w-2xl ">
            {/* <ResizablePanel> */}
            {sortedUrls ? <ScrapedSources urlHistory={sortedUrls} /> : null}
            {/* </ResizablePanel> */}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScrapedSources({ urlHistory }) {
  if (!urlHistory) return null
  return (
    <div className="my-2 ">
      <div className=" my-5 flex gap-2 ">
        <Icons.link className="h-4 w-4  stroke-indigo-10 dark:stroke-mint-9" />
        <p className=" font-aboreto text-sm font-bold leading-tight tracking-wide text-indigo-10 dark:text-mint-9">
          {`${urlHistory.length} ${pluralize("SOURCE", urlHistory.length)}`}
        </p>
      </div>
      <LayoutGroup>
        <motion.ul layout className=" my-5 flex flex-wrap items-center gap-2">
          {urlHistory.map((source, i) => (
            <LinkPill key={`${source}-${i}`} order={i} name={source.url} />
          ))}
        </motion.ul>
      </LayoutGroup>
    </div>
  )
}
