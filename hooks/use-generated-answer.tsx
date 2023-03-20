import useSWRMutation from "swr/mutation"

async function sendRequest(url, { arg }: { arg: { question: string } }) {
  console.log("question", arg.question)
  const { question } = arg
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  })

  if (!response.ok) {
    throw new Error(response.statusText)
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

export const useGeneratedAnswer = () => {
  const { data, trigger, error, isMutating } = useSWRMutation(
    "/api/learn",
    sendRequest
  )

  return {
    loading: isMutating,
    answer: data,
    error,
    trigger,
  }
}
