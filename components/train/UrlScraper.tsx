import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { truncateLongUrl } from "@/lib/utils"
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

  const { loading, trigger } = useScrapeEmbed("embed-webpage")

  function handleChange(e) {
    setStatus("typing")
    return setUrls(e.target.value.split("\n"))
  }

  const handleSubmit = async (e) => {
    setStatus("loading")
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
    setUrls([])
    try {
      const result = await trigger({ urls, namespace })
      setStatus("complete")
      toast({
        title: "✅ Success! ",
        description: `Scraped ${truncateLongUrl(
          urls[0],
          15
        )} in namespace: ${namespace}`,
      })
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
    <div className="flex h-48 flex-col items-center justify-between ">
      <div className="mt-8 w-80">
        <Input
          placeholder="https://react.dev/"
          value={urls.join("\n")}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="mt-auto">
        <LoadingButton
          status={status}
          handleSubmit={handleSubmit}
          disabled={urls.length < 1 || loading}
        />
      </div>
    </div>
  )
}

function LoadingButton({ handleSubmit, disabled, status }) {
  return (
    <GlowButton
      disabled={disabled}
      className=""
      variant="ghost"
      onClick={handleSubmit}
    >
      <div className="flex w-full items-center px-6 py-1">
        {status === "loading" ? (
          <Icons.loadingSpinner className="mr-2 h-5 w-5 animate-spin stroke-teal-500/80  dark:stroke-teal-400 " />
        ) : status === "complete" ? (
          <Icons.check className="mr-2 h-5 w-5" />
        ) : (
          <Icons.web className="mr-2 h-5 w-5" aria-hidden="true" />
        )}
        <span>Scrape</span>
      </div>
    </GlowButton>
  )
}

export { UrlScraper }
