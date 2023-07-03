'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { type Message, useChat } from 'ai/react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { EmptyScreen } from '@/components/empty-screen'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { FileUpload } from '@/components/train/FileUpload'
import { UrlScraper } from '@/components/train/UrlScraper'
import { Card } from '@/components/card'
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem
} from '@/components/ui/accordion'

import { Switch } from '@/components/ui/switch'

import { useTabs } from '@/components/tabs/tab-context'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const { tabs, activeTab } = useTabs()

  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [showDocumentSettings, setShowDocumentSettings] = useState(true)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      api: '/api/vector-query',
      id,
      body: {
        id,
        previewToken
      }
    })

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {activeTab === tabs[1].id && (
          <div className="flex flex-col pb-4 items-center justify-center">
            <h2 className="max-w-md">
              Set a pinecone <span className="font-bold"> namespace</span> and
              create vector embeddings by Uploading Files or Scraping Web pages
            </h2>

            <div className="flex pb-4 justify-center">
              <Switch
                isSelected={showDocumentSettings}
                onChange={setShowDocumentSettings}
              >
                Show Settings
              </Switch>
            </div>
          </div>
        )}
        {activeTab === tabs[1].id && showDocumentSettings && (
          <div className="flex gap-6 justify-center">
            <Card
              cardDetails={{ name: 'Upload any File', description: 'File' }}
            >
              <FileUpload namespace="any" />
            </Card>
            <Card
              cardDetails={{
                name: 'Embed any website',
                description: 'Web'
              }}
            >
              <UrlScraper namespace="any" />
            </Card>
          </div>
        )}
        {messages.length && (
          <div>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </div>
        )}
      </div>

      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
