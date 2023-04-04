import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import { Icons } from "@/components/icons"

// Animation properties
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2.5 } },
  exit: { opacity: 0, transition: { duration: 0.02 } },
}

export function Answer({ submittedQ, content, error }) {
  return (
    <div className="h-auto">
      <AnimatedQuestion submittedQ={submittedQ} />
      <div className="pt-2">
        <div className="flex items-center">
          <Icons.arrowDR className="h-6 w-6 text-indigo-600 dark:text-teal-400" />
          <p className="font-aboreto text-sm font-bold leading-tight tracking-wide text-indigo-600 dark:text-teal-400">
            MERCURIAL
          </p>
        </div>
        <div className="w-full md:min-w-[768px]">
          {error || !content ? (
            <LoadingLine />
          ) : (
            <MarkdownRenderer content={content} className="max-w-3xl" />
          )}
        </div>
      </div>
    </div>
  )
}

function AnimatedQuestion({ submittedQ }) {
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
