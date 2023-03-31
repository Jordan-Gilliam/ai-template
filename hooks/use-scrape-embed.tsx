import useSWRMutation from "swr/mutation"
import { toast } from "@/hooks/use-toast"

async function sendRequest(
  url,
  { arg }: { arg: { urls: string[]; namespace: string } }
) {
  const { urls, namespace } = arg

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      namespace: !!namespace ? namespace : "default-namespace",
    },
    body: JSON.stringify({ urls }),
  })

  if (!response.ok) {
    toast({
      title: "You need to configure API Keys to use this app",
      description: response.statusText,
    })
  }

  const data = response.body

  if (!data) {
    return
  }
}

export const useScrapeEmbed = (url: string) => {
  const { trigger, error, isMutating } = useSWRMutation(
    `/api/${url}`,
    sendRequest
  )

  return {
    loading: isMutating,
    error,
    trigger,
  }
}
