import { type UseChatHelpers } from 'ai/react'

import { LayoutGroup, motion } from 'framer-motion'
import { SearchInput } from '@/components/query/SearchInput'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'

import { GlowPill } from '@/components/ui/button'
import { IconRefresh, IconStop } from '@/components/ui/icons'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages
}: ChatPanelProps) {
  return (
    <div className="from-muted/10 to-muted/30 fixed inset-x-0 bottom-0 bg-gradient-to-b from-10% to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <GlowPill
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </GlowPill>
          ) : (
            messages?.length > 0 && (
              <GlowPill
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </GlowPill>
            )
          )}
        </div>
        {/* <div className="bg-background space-y-4 border-t px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4"> */}
        <div className="bg-background space-y-4 py-2  md:py-6">
          {/* <PromptForm
            onSubmit={async value => {
              await append({
                id,
                content: value,
                role: 'user'
              })
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          /> */}
          <motion.div
            layout
            className="flex w-full max-w-4xl flex-col items-center justify-center "
          >
            <SearchInput
              status={status}
              value={input}
              handleClick={async value => {
                await append({
                  id,
                  content: value,
                  role: 'user'
                })
              }}
              handleChange={setInput}
              loading={isLoading}
              placeholder="Query Embeddings"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
