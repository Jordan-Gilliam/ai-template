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

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch {
    return false
  }
}

function removeLeadingDash(pathPart: string): string {
  return pathPart.startsWith(` - `) ? pathPart.substring(1) : pathPart
}

function getSecondLevelDomain(hostname: string): string {
  return hostname.split(".").slice(-2, -1).join(".")
}

function removeFileExtension(pathPart: string | undefined): string {
  if (!pathPart) return ""
  return pathPart.replace(/\.[^/.]+$/, "")
}

function shortenLastPathPart(pathPart: string, maxLength: number): string {
  if (!pathPart) return ""
  return pathPart.length > maxLength
    ? pathPart.substring(0, maxLength)
    : pathPart
}

export function truncateLongUrl(
  longUrl: string,
  maxLength: number = 15
): string {
  if (!isValidUrl(longUrl)) return "Invalid URL"

  const cleanUrl = removeLeadingDash(longUrl)
  const url = new URL(cleanUrl)
  const hostname = getSecondLevelDomain(url.hostname)
  const pathParts = url.pathname.split("/").filter((part) => part !== "")
  let lastPathPart = pathParts[pathParts.length - 1]

  lastPathPart = removeFileExtension(lastPathPart)
  lastPathPart = shortenLastPathPart(lastPathPart, maxLength)

  const shortUrl = `${hostname}${lastPathPart ? "/" : ""}${lastPathPart}`
  //   return shortUrl
  return shortUrl.replace(/-/g, "")
}

export function truncateLongFileName(
  fileName: string,
  maxLength: number = 15
): string {
  const fileBaseName = fileName.replace(/\.[^/.]+$/, "") // Remove file extension
  const hyphenatedName = fileBaseName.replace(/\W+/g, "-") // Replace non-word characters with hyphens
  const truncatedName = hyphenatedName.slice(0, maxLength) // Truncate to the specified maxLength
  const cleanTruncatedName = truncatedName.replace(/-$/, "") // Remove trailing hyphen if present

  // Add back the file extension
  const fileExtension = fileName.match(/\.[^/.]+$/) || [""]
  const truncatedFileName = `${cleanTruncatedName}${fileExtension[0]}`

  return truncatedFileName
}

// A function that takes a file name and a string and returns true if the file name is contained in the string
// after removing punctuation and whitespace from both
export const isFileNameInString = (fileName: string, str: string) => {
  // Check if the input string is null or undefined
  if (!str) {
    return false
  }

  // Convert both to lowercase and remove punctuation and whitespace
  const normalizedFileName = fileName
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=-_~()\s]/g, "")
  const normalizedStr = str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=-_~()\s]/g, "")

  // Return true if the normalized file name is included in the normalized string
  return normalizedStr.includes(normalizedFileName)
}
