import { AnimatePresence, motion } from "framer-motion"
import { pluralize } from "@/lib/utils"
import { DocumentSourcePill, LinkPill } from "@/components/LinkPill"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import { Icons } from "@/components/icons"

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
        <Icons.arrowDR className="h-6 w-6 stroke-indigo-10 dark:stroke-mint-9" />
        <p className=" font-aboreto text-sm font-bold leading-tight tracking-wide text-indigo-10 dark:text-mint-9">
          MERCURIAL
        </p>
      </div>
      <div className="mb-3 ">
        {!error && content ? (
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
        <Icons.link className="h-4 w-4  stroke-indigo-10 dark:stroke-mint-9" />

        <p className=" font-aboreto text-sm font-bold leading-tight tracking-wide text-indigo-10 dark:text-mint-9">
          {`${sources.length} ${pluralize("SOURCE", sources.length)}`}
        </p>
      </div>
      <motion.ul layout className=" my-5 flex gap-2 ">
        {sources.map((url, i) => (
          <LinkPill key={`${url}-${i}`} order={i} name={url} />
        ))}
      </motion.ul>
    </div>
  )
}

function DocumentSources({ sources }) {
  if (!sources) return null
  return (
    <div className="my-2 border-t border-mauve-7">
      <div className=" my-5 flex gap-2 ">
        <Icons.link className="h-4 w-4  stroke-indigo-10 dark:stroke-mint-9" />

        <p className=" font-aboreto text-sm font-bold leading-tight tracking-wide text-indigo-10 dark:text-mint-9">
          {`${sources.length} ${pluralize("SOURCE", sources.length)}`}
        </p>
      </div>
      <motion.ul layout className=" my-5 flex flex-col gap-3  ">
        {sources.map((doc, i) => (
          <DocumentSourcePill
            key={`document-${i}`}
            order={i}
            name={doc.pageContent}
          />
        ))}
      </motion.ul>
    </div>
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
