import { useState } from "react"
import { LayoutGroup, motion } from "framer-motion"
import { BugIcon, Loader2 } from "lucide-react"
import { pluralize } from "@/lib/utils"
import { LinkPill } from "@/components/LinkPill"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useScrapeIngest } from "@/hooks/use-scrape-ingest"
import { toast } from "@/hooks/use-toast"
import { useHasHydrated, useUrlHistory } from "@/hooks/use-url-history"

type Props = {
  namespace?: string
}

export function UrlScraper({ namespace }: Props) {
  const [urls, setUrls] = useState<string[]>([])
  const [status, setStatus] = useState("idle")

  const isHydrated = useHasHydrated()
  const { urlHistory, addUrlToHistory } = useUrlHistory()

  const api = !!namespace
    ? "pinecone-scrape-ingest-webpage"
    : "supabase-scrape-ingest-webpage"

  const { loading, trigger } = useScrapeIngest(api)

  function handleChange(e) {
    setStatus("typing")
    return setUrls(e.target.value.split("\n"))
  }

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  const handleSubmit = async (e) => {
    if (!urls) {
      return toast({
        title: "Please enter a url",
      })
    }
    try {
      const result = await trigger({ urls, namespace })
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
    // <div className="flex flex-col items-center py-2">
    <div className="flex  h-48 flex-col items-center justify-between ">
      {/* <div className="relative flex flex-col items-center justify-center"> */}
      <div className="mt-8">
        <Input
          placeholder="https://react.dev/"
          value={urls.join("\n")}
          onChange={handleChange}
        />
      </div>

      <div className="mt-auto">
        <Button
          disabled={urls.length < 1 || loading}
          className=" bg-neutral-300/70 px-16 py-3.5 hover:bg-neutral-400/50 dark:bg-neutral-700/50 dark:hover:bg-neutral-750/50"
          variant="ghost"
          onClick={handleSubmit}
        >
          {!loading ? (
            <BugIcon className="mr-2 h-4 w-4" />
          ) : (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Scrape
        </Button>
      </div>
    </div>
    // </div>
  )
}

// function ScrapedSources({ urlHistory }) {
//   if (!urlHistory) return null
//   return (
//     <div className="my-2 ">
//       <div className=" my-5 flex gap-2 ">
//         <Icons.link className="h-4 w-4  stroke-teal-10 dark:stroke-teal-9" />
//         <p className=" font-aboreto text-sm font-bold leading-tight tracking-wide text-teal-10 dark:text-teal-10">
//           {`${urlHistory.length} ${pluralize("SOURCE", urlHistory.length)}`}
//         </p>
//       </div>
//       <LayoutGroup>
//         <motion.ul layout className=" my-5 flex flex-wrap items-center gap-2">
//           {urlHistory.map((source, i) => (
//             <LinkPill key={`${source.url}-${i}`} order={i} source={source} />
//           ))}
//         </motion.ul>
//       </LayoutGroup>
//     </div>
//   )
// }
