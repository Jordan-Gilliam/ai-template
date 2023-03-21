// function getLastUrlSegment(url) {
//   return new URL(url).pathname.split("/").filter(Boolean).pop() ?? ""
// }

// function getHostShortName(url) {
//   return new URL(url).hostname.split("www.").filter(Boolean).pop()
// }

function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch (_) {
    return false
  }
}

function getLastUrlSegment(url) {
  if (!isValidUrl(url)) {
    console.error(`Invalid URL in getLastUrlSegment: '${url}'`)
    return null
  }

  const pathname = new URL(url).pathname
  const segments = pathname.split("/").filter(Boolean)
  return segments.pop()
}

function getHostShortName(url) {
  if (!isValidUrl(url)) {
    console.error(`Invalid URL in getHostShortName: '${url}'`)
    return null
  }

  const hostname = new URL(url).hostname
  const shortName = hostname.split("www.").filter(Boolean).pop()
  return shortName
}

export function LinkPill({ order, name }) {
  const url = name.includes("http") ? name.replace(/^-+/g, "") : `${name}`
  const lastUrlSegment = getLastUrlSegment(url)
  const host = getHostShortName(url)

  return (
    <div className=" group block max-w-lg cursor-pointer rounded-full ">
      <div className="group flex items-center gap-x-2 divide-x divide-mauve-9 rounded-full border border-mauve-9  bg-transparent p-2  transition duration-300 group-hover:border-pink-10">
        <div className="divide-zinc-200 border-zinc-200 bg-transparent pl-2 transition duration-300 ">
          <div className=" font-aboreto text-xs font-bold uppercase leading-none tracking-widest text-mauve-11 transition duration-300 selection:bg-mint-8 selection:text-white group-hover:text-indigo-9 dark:group-hover:text-mint-10 ">
            {order + 1}
          </div>
        </div>
        <div className="px-3">
          <div className="flex items-center gap-x-1 divide-mauve-1 border-mauve-6 bg-transparent transition duration-300 ">
            <div className="top-one relative">
              <div className="overflow-hidden rounded-full"></div>
            </div>
            <div className="font-sans text-sm text-mauve-12 transition-all duration-300 selection:bg-mint-8 selection:text-white group-hover:text-indigo-9 dark:group-hover:text-mint-10 ">
              {`${host}/${lastUrlSegment}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
