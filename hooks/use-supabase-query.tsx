import useSWRMutation from "swr/mutation"
import { toast } from "@/hooks/use-toast"

async function sendRequest(url, { arg }: { arg: { question: string } }) {
  const { question } = arg

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
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

  const reader = data.getReader()
  const decoder = new TextDecoder()
  let result = ""
  let done = false

  while (!done) {
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    const chunkValue = decoder.decode(value)
    result += chunkValue
  }

  return result
}

export const useSupabaseQuery = () => {
  const { data, trigger, error, isMutating } = useSWRMutation(
    "/api/supabase-query",
    sendRequest
  )

  return {
    loading: isMutating,
    answer: data,

    error,
    trigger,
  }
}
