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

export function formatLongUrl(longUrl: string, maxLength: number = 15): string {
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
