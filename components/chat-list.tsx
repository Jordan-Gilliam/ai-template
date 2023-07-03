import { type Message } from 'ai'
import { ChatMessage } from '@/components/chat-message'

import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AnswerCard } from '@/components/perplexity/Answer'
import { Separator } from '@/components/ui/separator'

export interface ChatList {
  messages: Message[]
}

export function ChatList({ messages }: ChatList) {
  if (!messages.length) {
    return null
  }

  const aiAnswer = messages.filter(message => message.role !== 'user')
  const userQuestion = messages.filter(message => message.role === 'user')

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      <LayoutGroup>
        {aiAnswer.map((answer, i) => {
          const isCurrentAnswer = aiAnswer.length - 1 === i
          const currentAnswer = userQuestion[userQuestion.length - 1]

          return (
            <AnswerCard
              question={currentAnswer.content}
              key={`${aiAnswer[aiAnswer.length - 1]}-container-${i}`}
              answer={answer}
              isCurrentAnswer={isCurrentAnswer}
              status={status}
            />
          )
        })}
      </LayoutGroup>
    </div>
  )
}
