import React from 'react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ResizablePanel } from '@/components/animations/ResizablePanel'
import { Icons } from '@/components/icons'
import { Sources } from '@/components/perplexity/Sources'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { CodeBlock } from '@/components/ui/codeblock'

// Animation properties
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2.5 } },
  exit: { opacity: 0, transition: { duration: 0.02 } }
}

type Source = {
  metadata: {
    type: string
    source: string
  }
  pageContent?: string
}

type AnswerCardProps = {
  answer: {
    sourceDocs?: Source[]
    content: string
  }
  question: string
  isCurrentAnswer: boolean
  status: string
}

export function AnswerCard({
  answer,
  question,
  isCurrentAnswer,
  status
}: AnswerCardProps) {
  return (
    <div className="py-10 max-w-6xl">
      <div
        className={cn(
          'border-neutral-focus rounded-xl border bg-neutral-100/50 p-4 shadow-md backdrop-blur w-full',
          'hover:border-accent-focus text-left transition',
          'dark:border-black/30 dark:bg-black/50',
          isCurrentAnswer
            ? 'border border-indigo-200 ring-1 ring-inset transition duration-150 dark:border-indigo-400/80 dark:ring-indigo-500/40'
            : ''
        )}
      >
        <ResizablePanel content={answer}>
          <div className="pb-8">
            <AnswerMessage
              isCurrentAnswer={isCurrentAnswer}
              content={answer}
              error={status === 'error'}
              submittedQ={question}
            />
          </div>
          <AnimatePresence>
            {answer.sourceDocs ? (
              <Sources sources={answer.sourceDocs ?? []} />
            ) : null}
          </AnimatePresence>
        </ResizablePanel>
      </div>
    </div>
  )
}

type AnswerMessageProps = {
  submittedQ: string
  isCurrentAnswer: boolean
  content: {
    sourceDocs?: Source[]
    content: string
  }
  error: boolean
}

export function AnswerMessage({
  submittedQ,
  isCurrentAnswer,
  content,
  error
}: AnswerMessageProps) {
  return (
    <>
      <AnimatedQuestion submittedQ={submittedQ} />
      <div className="w-full py-2">
        <div className="flex items-center">
          <Icons.arrowDR className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <p className="font-aboreto text-sm font-bold leading-tight tracking-wide text-indigo-600 dark:text-indigo-400">
            MERCURIAL
          </p>
        </div>
        <div className="w-full max-w-full py-2">
          <MemoizedReactMarkdown
            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>
              },
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] === '▍') {
                    return (
                      <span className="mt-1 mb-2 animate-pulse cursor-default">
                        ▍
                      </span>
                    )
                  }
                  children[0] = (children[0] as string).replace('▍', '▍')
                }
                const match = /language-(\w+)/.exec(className || '')
                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ''}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                )
              }
            }}
          >
            {content.content}
          </MemoizedReactMarkdown>
        </div>
      </div>
    </>
  )
}

type AnimatedQuestionProps = {
  submittedQ: string
}

function AnimatedQuestion({ submittedQ }: AnimatedQuestionProps) {
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
