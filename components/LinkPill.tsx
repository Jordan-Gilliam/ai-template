import { getHostShortName, getLastUrlSegment } from "@/lib/utils"

export function LinkPill({ order, name }) {
  const url = name.includes("http") ? name.replace(/^-+/g, "") : `${name}`
  const lastUrlSegment = getLastUrlSegment(url)
  const host = getHostShortName(url)

  return (
    <li className=" group block max-w-lg cursor-pointer rounded-full ">
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
    </li>
  )
}
