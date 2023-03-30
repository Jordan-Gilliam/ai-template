import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export function pluralize(
//   word: string,
//   count: number,
//   pluralForm?: string
// ): string {
//   if (count === 1) {
//     return word
//   }

//   if (pluralForm) {
//     return pluralForm
//   }

//   return `${word}s`
// }

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

// export function getLastUrlSegment(url) {
//   if (!isValidUrl(url)) {
//     console.error(`Invalid URL in getLastUrlSegment: '${url}'`)
//     return null
//   }

//   const pathname = new URL(url).pathname
//   const segments = pathname.split("/").filter(Boolean)
//   return segments.pop()
// }

// export function getHostShortName(url) {
//   if (!isValidUrl(url)) {
//     console.error(`Invalid URL in getHostShortName: '${url}'`)
//     return null
//   }

//   const hostname = new URL(url).hostname
//   const shortName = hostname.split("www.").filter(Boolean).pop()
//   return shortName
// }

// function isValidUrl(urlString: string): boolean {
//   try {
//     new URL(urlString)
//     return true
//   } catch {
//     return false
//   }
// }

// function removeLeadingDash(pathPart: string): string {
//   return pathPart.startsWith(` - `) ? pathPart.substring(1) : pathPart
// }

// function getSecondLevelDomain(hostname: string): string {
//   return hostname.split(".").slice(-2, -1).join(".")
// }

// function removeFileExtension(pathPart: string | undefined): string {
//   if (!pathPart) return ""
//   return pathPart.replace(/\.[^/.]+$/, "")
// }

// function shortenLastPathPart(pathPart: string, maxLength: number): string {
//   if (!pathPart) return ""
//   return pathPart.length > maxLength
//     ? pathPart.substring(0, maxLength)
//     : pathPart
// }

// export function formatLongUrl(longUrl: string, maxLength: number = 15): string {
//   if (!isValidUrl(longUrl)) return "Invalid URL"

//   const cleanUrl = removeLeadingDash(longUrl)
//   const url = new URL(cleanUrl)
//   const hostname = getSecondLevelDomain(url.hostname)
//   const pathParts = url.pathname.split("/").filter((part) => part !== "")
//   let lastPathPart = pathParts[pathParts.length - 1]

//   lastPathPart = removeFileExtension(lastPathPart)
//   lastPathPart = shortenLastPathPart(lastPathPart, maxLength)

//   const shortUrl = `${hostname}${lastPathPart ? "/" : ""}${lastPathPart}`
//   //   return shortUrl
//   return shortUrl.replace(/-/g, "")
// }
