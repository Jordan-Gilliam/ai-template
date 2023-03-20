import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getContentAndSources(loading, answer) {
  if (loading) {
    return { content: "", sources: [] }
  }

  const sourceList = answer ? answer.split("SOURCES:") : []
  const content = sourceList[0] || ""
  const sources = sourceList[1]
    ? sourceList[1]
        .trim()
        .split("\n")
        .filter((url) => url.trim().length > 0)
    : []

  return { content, sources }
}

export function parseResponse(response) {
  const codeRegex = /\[CODE\]([\s\S]*?)(?=\[TEXT\]|\[CODE\]|$)/g
  const textRegex = /\[TEXT\]([\s\S]*?)(?=\[TEXT\]|\[CODE\]|$)/g

  const codeMatches = [...response.matchAll(codeRegex)].map((match) => ({
    type: "code",
    content: match[1].trim(),
  }))

  const textMatches = [...response.matchAll(textRegex)].map((match) => ({
    type: "text",
    content: match[1].trim(),
  }))

  const otherContent = response
    .replace(codeRegex, "")
    .replace(textRegex, "")
    .trim()

  const unknownMatch = otherContent
    ? [
        {
          type: "unknown",
          content: otherContent,
        },
      ]
    : []

  return [...textMatches, ...codeMatches, ...unknownMatch]
}
