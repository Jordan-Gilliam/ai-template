import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pluralize(
  word: string,
  count: number,
  pluralForm?: string
): string {
  if (count === 1) {
    return word
  }

  if (pluralForm) {
    return pluralForm
  }

  return `${word}s`
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

export function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch (_) {
    return false
  }
}

export function getLastUrlSegment(url) {
  if (!isValidUrl(url)) {
    console.error(`Invalid URL in getLastUrlSegment: '${url}'`)
    return null
  }

  const pathname = new URL(url).pathname
  const segments = pathname.split("/").filter(Boolean)
  return segments.pop()
}

export function getHostShortName(url) {
  if (!isValidUrl(url)) {
    console.error(`Invalid URL in getHostShortName: '${url}'`)
    return null
  }

  const hostname = new URL(url).hostname
  const shortName = hostname.split("www.").filter(Boolean).pop()
  return shortName
}
