import { useState } from "react"
import { Icons } from "@/components/icons"
import { GlowButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useScrapeEmbed } from "@/hooks/use-scrape-embed"
import { toast } from "@/hooks/use-toast"

type Props = {
  namespace?: string
}

function UrlScraper({ namespace }: Props) {
  const [urls, setUrls] = useState<string[]>([])
  const [status, setStatus] = useState("idle")

  const api = !!namespace
    ? "pinecone-scrape-ingest-webpage"
    : "supabase-scrape-ingest-webpage"

  const { loading, trigger } = useScrapeEmbed(api)

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

    if (!namespace) {
      return toast({
        title: "Please enter a pinecone namespace",
      })
    }
    try {
      const result = await trigger({ urls, namespace })
      setStatus("complete")

      return result
    } catch (e) {
      setStatus("error")
      return toast({
        title: "Uh oh! Something went wrong.",
        description: e,
      })
    }
  }

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
    <GlowButton
      disabled={disabled}
      className=""
      variant="ghost"
      onClick={handleSubmit}
    >
      <div className="flex items-center px-6 py-1">
        {!loading ? (
          <Icons.web className="mr-2 h-4 w-4" />
        ) : (
          <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
        )}
        Scrape
      </div>
    </GlowButton>
  )
}

export { UrlScraper }
