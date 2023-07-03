'use client'

import { useState, MouseEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

import { cn } from '@/lib/utils'

export type CardDetails = {
  name: string
  description: string
  items?: string[]
}

export function Card({
  cardDetails,
  children
}: {
  cardDetails?: CardDetails
  children: React.ReactNode
}) {
  let mouseX = useMotionValue(0)
  let mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect()

    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className="group relative max-w-md rounded-xl border border-white/10 bg-neutral-900 px-4 py-4 shadow-2xl"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(193, 175, 220, 0.15),
              transparent 80%
            )
          `
        }}
      />
      <div>
        <h3 className="text-base font-semibold leading-7 text-neutral-400">
          {cardDetails?.description}
        </h3>
        <div className="mt-2 flex items-center gap-x-2">
          <span className="text-xl font-bold tracking-tight text-white">
            {cardDetails?.name ?? ''}
          </span>
        </div>
        <div className="mt-2 flex justify-center items-center gap-x-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export const Card2 = ({
  cardDetails,
  children
}: {
  cardDetails?: CardDetails
  children: React.ReactNode
}) => {
  const [highlight, setHighlight] = useState(false)

  return (
    <div
      onMouseEnter={() => setHighlight(true)}
      onMouseLeave={() => setHighlight(false)}
      className={cn(
        'flex min-h-[350px] w-full flex-col items-center rounded-xl pt-7 md:w-full',
        'bg-transparent ring-inset ring-indigo-100/25 backdrop-blur dark:border-indigo-500/50 dark:bg-neutral-600/30 ',
        {
          'border border-neutral-400/50 shadow-md transition duration-150 dark:border-neutral-500/30 ':
            !highlight,
          'shadow-box border border-indigo-900/30 transition duration-150 ':
            highlight
        }
      )}
    >
      <h2 className="flex-none px-4 text-xl font-semibold text-neutral-900 dark:text-white md:px-8 md:text-3xl">
        {cardDetails?.name ?? ''}
      </h2>
      <div className=" px-4 md:px-8">
        <p className="my-2 text-center text-base text-neutral-800 dark:text-neutral-100 md:text-lg">
          {cardDetails?.description}
        </p>
      </div>

      <div className="mx-3 mt-2 px-3 backdrop-blur-none">{children}</div>
    </div>
  )
}
