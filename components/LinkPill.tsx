import { motion } from "framer-motion"
import { formatLongUrl } from "@/lib/utils"

// const staggerMenuItems = stagger(0.1, { startDelay: 0.15 })

export function LinkPill({ order, name }) {
  console.log("url", name)
  const maxPathLength = 15
  const shortUrl = formatLongUrl(name, maxPathLength)

  return (
    <motion.li
      layout
      initial="initial"
      className=" group block max-w-lg cursor-pointer rounded-full "
    >
      <motion.a
        href={name}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-x-2 divide-x divide-mauve-9 rounded-full border border-mauve-9  bg-transparent p-2  transition duration-300 group-hover:border-pink-10"
      >
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
              {shortUrl}
            </div>
          </div>
        </div>
      </motion.a>
    </motion.li>
  )
}

export function DocumentSourcePill({ order, name }) {
  return (
    <motion.li
      layout
      initial="initial"
      className=" group mb-4 block  cursor-pointer border-b border-mauve-7"
    >
      <motion.div className="group flex items-center gap-x-2 divide-x divide-mauve-9 rounded-xl   bg-transparent p-2  transition duration-300 group-hover:border-pink-10">
        <div className="divide-zinc-200 border-zinc-200 bg-transparent pl-2 transition duration-300 ">
          <div className=" font-aboreto text-xs font-bold uppercase leading-none tracking-widest text-mauve-11 transition duration-300 selection:bg-mint-8 selection:text-white group-hover:text-indigo-9 dark:group-hover:text-mint-10 ">
            {order + 1}
          </div>
        </div>
        <div className="px-3 pb-3">
          <div className="flex items-center gap-x-1 divide-mauve-1 border-mauve-6 bg-transparent transition duration-300 ">
            <div className="top-one relative">
              <div className="overflow-hidden rounded-full"></div>
            </div>
            <div className="font-sans text-sm text-mauve-12 transition-all duration-300 selection:bg-mint-8 selection:text-white group-hover:text-indigo-9 dark:group-hover:text-mint-10 ">
              {name}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.li>
  )
}
