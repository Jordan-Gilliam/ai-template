import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronsUpDown, ListIcon, Plus, X } from "lucide-react"
import { formatLongUrl } from "@/lib/utils"
import { pluralize } from "@/lib/utils"
import { DocumentSourcePill, LinkPill } from "@/components/LinkPill"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

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
      <motion.ul layout className=" my-5 flex gap-2 ">
        {sources.map((source, i) => (
          <LinkPill key={`${source}-${i}`} order={i} source={source} />
        ))}
      </motion.ul>
    </div>
  )
}

function DocumentSources({ sources }) {
  const [isList, setIsList] = React.useState(false)
  if (!sources) return null
  return (
    <div className="my-2 border-t border-mauve-7">
      <Collapsible
        open={isList}
        onOpenChange={setIsList}
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
        <motion.ul className="mb-2 flex gap-2">
          {sources.map((source, i) => (
            <LinkPill
              key={`${source.metadata.type}-${i}`}
              order={i}
              source={source}
            />
          ))}
        </motion.ul>
        <CollapsibleContent className="mt-2 space-y-2">
          <div className="rounded-md border border-mauve-8 px-4 py-3 text-sm ">
            <motion.ul layout className=" my-2 flex flex-col gap-3  ">
              {sources.map((source, i) => (
                <DocumentSourcePill
                  key={`document-${i}`}
                  order={i}
                  name={source.pageContent}
                />
              ))}
            </motion.ul>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export function CollapsibleSource({ order, source, children }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const maxPathLength = 15
  const formattedSource =
    source.metadata.type === "scrape"
      ? formatLongUrl(source.metadata.source, maxPathLength)
      : source.metadata.source
  return (
    <Collapsible
      key={`collapse-source-${order}`}
      open={isOpen}
      onOpenChange={setIsOpen}
      className=" space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">
          [{order + 1}] {formattedSource}
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
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
