import useSWRMutation from "swr/mutation"

async function sendRequest(url, { arg }: { arg: { urls: string[] } }) {
  console.log("urls", arg.urls)
  const { urls } = arg

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const data = response.body

  if (!data) {
    return
  }
}

export const useGenerateEmbeddings = () => {
  const { trigger, error, isMutating } = useSWRMutation(
    "/api/generate-embeddings",
    sendRequest
  )

  return {
    loading: isMutating,
    error,
    trigger,
  }
}
