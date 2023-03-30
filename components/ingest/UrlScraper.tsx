import { useState } from "react"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useScrapeIngest } from "@/hooks/use-scrape-ingest"
import { toast } from "@/hooks/use-toast"
import { useHasHydrated, useUrlHistory } from "@/hooks/use-url-history"

type Props = {
  namespace?: string
}

function UrlScraper({ namespace }: Props) {
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
    <div className="flex  h-48 flex-col items-center justify-between ">
      <div className="mt-8">
        <Input
          placeholder="https://react.dev/"
          value={urls.join("\n")}
          onChange={handleChange}
        />
      </div>

      <div className="mt-auto">
        <LoadingButton
          loading={loading}
          handleSubmit={handleSubmit}
          disabled={urls.length < 1 || loading}
        />
      </div>
    </div>
  )
}

function LoadingButton({ loading, handleSubmit, disabled }) {
  return (
    <Button
      disabled={disabled}
      className=" bg-neutral-300/70 px-16 py-3.5 hover:bg-neutral-400/50 dark:bg-neutral-700/50 dark:hover:bg-neutral-750/50"
      variant="ghost"
      onClick={handleSubmit}
    >
      {!loading ? (
        <Icons.web className="mr-2 h-4 w-4" />
      ) : (
        <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
      )}
      Scrape
    </Button>
  )
}

export { UrlScraper }
