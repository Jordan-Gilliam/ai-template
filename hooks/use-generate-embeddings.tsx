import useSWRMutation from "swr/mutation"
import { toast } from "@/hooks/use-toast"

async function sendRequest(url, { arg }: { arg: { urls: string[] } }) {
  console.log("urls", arg.urls)
  const { urls } = arg

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export const useGenerateEmbeddings = () => {
  const { trigger, error, isMutating } = useSWRMutation(
    "/api/generate-embeddings",
    // "/api/generate-puppet",
    sendRequest
  )

  return {
    loading: isMutating,
    error,
    trigger,
  }
}
