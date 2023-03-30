import { motion } from "framer-motion"
import { formatLongUrl } from "@/lib/utils"

// const staggerMenuItems = stagger(0.1, { startDelay: 0.15 })

export function LinkPill({ order, source }) {
  const maxPathLength = 15

  console.log(source.metadata.type)
  const formattedSource =
    source.metadata.type === "scrape"
      ? formatLongUrl(source.metadata.source, maxPathLength)
      : source.metadata.source

  if (source.metadata.type === "scrape") {
    return (
      <motion.li
        layout
        initial="initial"
        className=" group block max-w-lg cursor-pointer rounded-full "
      >
        <motion.a
          href={source.metadata.source}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-x-2 divide-x divide-mauve-9 rounded-full border border-mauve-9  bg-transparent p-2  transition duration-300 group-hover:border-pink-10"
        >
          <div className="divide-zinc-200 border-zinc-200 bg-transparent pl-2 transition duration-300 ">
            <div className=" font-aboreto text-xs font-bold uppercase leading-none tracking-widest text-mauve-11 transition duration-300 selection:bg-teal-8 selection:text-white group-hover:text-teal-9 dark:group-hover:text-teal-10 ">
              {order + 1}
            </div>
          </div>
          <div className="px-2">
            <div className="flex items-center gap-x-1 divide-mauve-1 border-mauve-6 bg-transparent transition duration-300 ">
              <div className="font-sans text-sm text-mauve-12 transition-all duration-300 selection:bg-teal-8 selection:text-white group-hover:text-teal-9 dark:group-hover:text-teal-10 ">
                {formattedSource}
              </div>
            </div>
          </div>
        </motion.a>
      </motion.li>
    )
  }

  return (
    <motion.li
      layout
      initial="initial"
      className=" group block max-w-lg  rounded-full "
    >
      <motion.div className="group flex items-center gap-x-2 divide-x divide-mauve-9 rounded-full border border-mauve-9  bg-transparent p-2  transition duration-300 group-hover:border-pink-10">
        <div className="divide-zinc-200 border-zinc-200 bg-transparent pl-2 transition duration-300 ">
          <div className=" font-aboreto text-xs font-bold uppercase leading-none tracking-widest text-mauve-11 transition duration-300 selection:bg-teal-8 selection:text-white group-hover:text-teal-9 dark:group-hover:text-teal-10 ">
            {order + 1}
          </div>
        </div>
        <div className="px-3">
          <div className="flex items-center gap-x-1 divide-mauve-1 border-mauve-6 bg-transparent transition duration-300 ">
            <div className="top-one relative">
              <div className="overflow-hidden rounded-full"></div>
            </div>
            <div className="font-sans text-sm text-mauve-12 transition-all duration-300 selection:bg-teal-8 selection:text-white group-hover:text-teal-9 dark:group-hover:text-teal-10 ">
              {formattedSource}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.li>
  )
}

export function DocumentSourcePill({ order, name }) {
  return (
    <motion.li
      layout
      initial="initial"
      className=" group mb-4 block  cursor-pointer "
    >
      <motion.div className="group flex items-center gap-x-2  divide-mauve-8 rounded-xl   bg-transparent p-2  transition duration-300 group-hover:border-pink-10">
        <div className="divide-mauve-8 border-mauve-8 bg-transparent pl-2 transition duration-300 ">
          <div className=" font-aboreto text-xs font-bold uppercase leading-none tracking-widest text-mauve-11 transition duration-300 selection:bg-teal-8 selection:text-white group-hover:text-teal-9 dark:group-hover:text-teal-10 ">
            {order + 1}
          </div>
        </div>
        <div className="px-3 pb-3">
          <div className="flex items-center gap-x-1 divide-mauve-1 border-mauve-6 bg-transparent transition duration-300 ">
            <div className="top-one relative">
              <div className="overflow-hidden rounded-full"></div>
            </div>
            <div className="line-clamp-5 font-sans text-sm text-mauve-12 transition-all duration-300 selection:bg-teal-8 selection:text-white group-hover:text-teal-9 dark:group-hover:text-teal-10 ">
              {name}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.li>
  )
}
