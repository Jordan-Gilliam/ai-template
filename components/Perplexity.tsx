import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronsUpDown, ListIcon } from "lucide-react"
import { cn, formatLongUrl, pluralize } from "@/lib/utils"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useToggle } from "@/hooks/use-toggle"

function AnimatedQuestion({ submittedQ }) {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 3.5 } },
    exit: { opacity: 0, transition: { duration: 0.02 } },
  }

  return (
    <AnimatePresence>
      {submittedQ && (
        <motion.h2
          key={submittedQ}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeIn}
          className="mx-auto text-2xl font-bold tracking-tighter"
        >
          {submittedQ}
        </motion.h2>
      )}
    </AnimatePresence>
  )
}

function Answer({ submittedQ, content, error }) {
  return (
    <>
      <AnimatedQuestion submittedQ={submittedQ} />
      <div className="mt-5 flex items-center gap-2">
        <Icons.arrowDR className="h-6 w-6 stroke-teal-10 dark:stroke-teal-9" />
        <p className=" font-aboreto text-sm font-bold leading-tight tracking-wide text-teal-10 dark:text-teal-9">
          MERCURIAL
        </p>
      </div>
      <div className="mb-3 ">
        {!error && !!content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <LoadingLine />
        )}
      </div>
    </>
  )
}

const animateList = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
}

function Sources({ sources }) {
  if (!sources) return null
  return (
    <div className="my-2 border-t border-mauve-7">
      <div className=" my-5 flex gap-2 ">
        <Icons.link className="h-4 w-4  stroke-teal-10 dark:stroke-teal-9" />

        <p className=" font-aboreto text-sm font-bold leading-tight tracking-wide text-teal-10 dark:text-teal-9">
          {`${sources.length} ${pluralize("SOURCE", sources.length)}`}
        </p>
      </div>
      <motion.ul
        variants={animateList}
        initial="hidden"
        animate="visible"
        className=" my-5 flex gap-2 "
      >
        {sources.map((source, i) => (
          <SourcePill key={`${source}-${i}`} order={i} source={source} />
        ))}
      </motion.ul>
    </div>
  )
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.02 } },
}

function DocumentSources({ sources }) {
  const [isOpen, toggleIsOpen] = useToggle()

  if (!sources) return null
  return (
    <AnimatePresence>
      <motion.div className="my-2 border-t border-mauve-7">
        <Collapsible
          open={isOpen}
          onOpenChange={toggleIsOpen}
          className=" space-y-2"
        >
          <div className="flex items-center justify-between space-x-4 px-4">
            <div className="flex gap-2">
              <Icons.link className="h-4 w-4  stroke-teal-10 dark:stroke-teal-9" />

              <p className=" font-aboreto text-sm font-bold leading-tight tracking-wide text-teal-10 dark:text-teal-9">
                {`${sources.length} ${pluralize("SOURCE", sources.length)}`}
              </p>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="mt-2 w-9 p-0">
                <ListIcon className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <motion.ul
            variants={animateList}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-2 after:mb-2"
          >
            {sources.map((source, i) => (
              <SourcePill
                key={`${source.metadata.type}-${i}`}
                order={i}
                source={source}
              />
            ))}
          </motion.ul>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="rounded-md border border-mauve-8 px-4 py-3 text-sm ">
              <motion.ul
                // layout
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className=" my-2 flex flex-col gap-3  "
              >
                {sources.map((source, i) => (
                  <SourceContent
                    key={`document-${i}`}
                    order={i}
                    name={source.pageContent}
                  />
                ))}
              </motion.ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </motion.div>
    </AnimatePresence>
  )
}

const animateItem = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}
function SourcePill({ order, source }) {
  const maxPathLength = 15

  const formattedSource =
    source.metadata.type === "scrape"
      ? formatLongUrl(source.metadata.source, maxPathLength)
      : source.metadata.source

  if (source.metadata.type === "scrape") {
    return (
      <motion.li
        variants={animateItem}
        className=" group block max-w-lg cursor-pointer rounded-full "
      >
        <motion.a
          href={source.metadata.source}
          target="_blank"
          rel="noopener noreferrer"
          // className="group flex items-center gap-x-1 divide-x divide-mauve-9 rounded-full border border-mauve-9 bg-transparent  p-1 transition duration-300  group-hover:border-pink-10 md:gap-x-2 md:p-2"
          className="group flex items-center gap-x-1 divide-x divide-neutral-500 rounded-full border border-neutral-700/50 bg-transparent p-1 transition duration-300  group-hover:border-violet-10 dark:border-neutral-400/50 md:gap-x-2 md:p-2"
        >
          <div className="divide-zinc-200 border-zinc-200 bg-transparent transition duration-300 md:pl-2 ">
            <div className=" font-aboreto text-xs font-bold uppercase leading-none tracking-widest text-mauve-11 transition duration-300 selection:bg-teal-8 selection:text-white group-hover:text-teal-9 dark:group-hover:text-teal-11 ">
              {order + 1}
            </div>
          </div>
          <div className="px-1 md:px-3">
            <div className="flex items-center  divide-mauve-1 border-mauve-6 bg-transparent transition duration-300 ">
              <div className="font-sans text-sm text-mauve-12 transition-all duration-300 selection:bg-teal-8 selection:text-white group-hover:text-teal-9 dark:group-hover:text-teal-11 ">
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
      variants={animateItem}
      className="group block max-w-lg cursor-default rounded-full "
    >
      <motion.div className="group flex items-center gap-x-1 divide-x divide-neutral-500 rounded-full border border-neutral-700/50 bg-transparent p-1 transition duration-300  group-hover:border-violet-10 dark:border-neutral-400/50 md:gap-x-2 md:p-2">
        <div className="divide-zinc-200 border-zinc-200 bg-transparent pl-1.5 transition duration-300 md:pl-2 ">
          <div className=" font-aboreto text-xs font-bold uppercase leading-none tracking-widest text-mauve-11 transition duration-300 selection:bg-teal-8 selection:text-white group-hover:text-teal-9 dark:group-hover:text-teal-10 ">
            {order + 1}
          </div>
        </div>
        <div className="px-1 md:px-3">
          <div className="flex items-center  divide-mauve-1 border-mauve-6 bg-transparent transition duration-300 ">
            <div className="font-sans text-sm text-mauve-12 transition-all duration-300 selection:bg-teal-8 selection:text-white group-hover:text-teal-9 dark:group-hover:text-teal-10 ">
              {formattedSource}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.li>
  )
}

export function CollapsibleSource({ order, source, children }) {
  const [isOpen, toggleIsOpen] = useToggle()

  const maxPathLength = 15
  const formattedSource =
    source.metadata.type === "scrape"
      ? formatLongUrl(source.metadata.source, maxPathLength)
      : source.metadata.source
  return (
    <Collapsible
      key={`collapse-source-${order}`}
      open={isOpen}
      onOpenChange={toggleIsOpen}
      className=" space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">
          [{order + 1}] {formattedSource}
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="subtle" size="sm" className="w-9 p-0 ">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border border-mauve-8 px-4 py-3 font-mono text-sm ">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function AnimatedParagraph({ content, isOpen }) {
  return (
    <AnimatePresence>
      {content && (
        <motion.p
          key={content}
          initial="hidden"
          animate="visible"
          // layout
          exit="exit"
          variants={fadeIn}
          className={cn(
            " max-w-[240px] font-sans text-sm text-mauve-12 transition-all duration-300 selection:bg-teal-8 selection:text-white group-hover:text-violet-9 dark:group-hover:text-violet-11 md:max-w-full  ",
            isOpen ? "" : "line-clamp-5"
          )}
        >
          {content}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function SourceContent({ order, name }) {
  const [isOpen, toggleIsOpen] = useToggle()

  return (
    <motion.li
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      // layout
      exit="exit"
      key={order}
      className=" group mb-4 block  cursor-pointer "
      onClick={toggleIsOpen}
    >
      <div className="group flex items-center gap-x-2 rounded-xl  bg-transparent  transition duration-300 group-hover:border-pink-10">
        <div className=" bg-transparent pr-2 transition duration-300 ">
          <div className=" font-aboreto text-xs font-bold uppercase leading-none tracking-widest text-mauve-11 transition duration-300 selection:bg-teal-8 selection:text-white group-hover:text-teal-9 dark:group-hover:text-teal-10 ">
            {order + 1}
          </div>
        </div>
        <div className="mb-2 mr-2">
          <div className="flex items-center gap-x-1 bg-transparent transition duration-300 ">
            <AnimatedParagraph isOpen={isOpen} content={name} />
          </div>
        </div>
      </div>
    </motion.li>
  )
}

function LoadingLine() {
  return (
    <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
      <div className="flex grow space-x-3">
        <div className="min-w-0 flex-1">
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-mauve-4"></div>
              <div className="col-span-1 h-2 rounded bg-mauve-4"></div>
            </div>
            <div className="h-2 rounded bg-mauve-4"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Answer, Sources, LoadingLine, DocumentSources }
