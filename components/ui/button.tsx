'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

const GlowButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, disabled, size, ...props }, ref) => {
    return (
      <div
        className={cn(
          ' relative w-full before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-indigo-500/20 before:opacity-0   before:transition dark:before:border-indigo-400/70 dark:before:ring-2 dark:before:ring-indigo-900/40',
          ' input-shadow-glow after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-white/5 after:transition',
          !disabled &&
            'focus-within:before:opacity-100 focus-within:after:shadow-indigo-500/100 dark:after:shadow-white/5 dark:focus-within:after:shadow-indigo-500/20',
          !disabled &&
            'hover:before:opacity-100 hover:after:shadow-indigo-500/100  dark:hover:after:shadow-indigo-500/20'
        )}
      >
        <button
          className={cn(
            'w-full font-semibold shadow-md',
            !disabled &&
              ' focus:outline-none  focus:ring-1 focus:ring-inset focus:ring-neutral-800/10',
            !disabled &&
              ' hover:outline-none  hover:ring-1 hover:ring-inset  hover:ring-neutral-800/10',
            'disabled:cursor-not-allowed disabled:opacity-80   sm:leading-6 ',
            'dark:border dark:border-black/40 ',
            ' input-shadow rounded-lg  !outline-none',
            'relative border border-black/5 bg-white/80 px-3.5 py-2 text-black shadow-black/5 placeholder:text-neutral-800  focus:bg-white ',
            ' dark:bg-black/60 dark:text-white dark:shadow-black/10 dark:placeholder:text-neutral-500',
            !disabled && 'dark:hover:bg-black/70 dark:focus:bg-black/70',
            disabled && 'cursor-default',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
GlowButton.displayName = 'GlowButton'

const GlowPill = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, disabled, size, ...props }, ref) => {
    return (
      <div className="relative w-fit overflow-hidden">
        <div className="pointer-events-none absolute left-[15%] top-0 z-10 block h-px w-[40%] select-none bg-gradient-to-r from-indigo-600/0 from-0% via-indigo-600 via-50% to-indigo-600/0 to-100%"></div>
        <div className="pointer-events-none absolute left-[15%] top-0 z-10 block aspect-square w-[40%] -translate-y-1/2 select-none rounded-b-full bg-indigo-600/10 blur-md"></div>
        <button
          className="inline-flex flex-nowrap gap-2 whitespace-nowrap items-center justify-center text-sm font-medium transition-colors focus:outline-none focus:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-neutral-100 dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-900 dark:data-[state=open]:bg-neutral-800 bg-neutral-900 text-white hover:bg-neutral-700 active:scale-1 rounded-full focus:ring-0 focus:ring-offset-0 dark:bg-indigo-600/5 backdrop-blur-3xl border dark:border-indigo-600/40 dark:text-white dark:hover:bg-indigo-600/10 dark:focus:border-indigo-600 px-4 py-3 sm:px-6 sm:py-[11px]"
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
GlowPill.displayName = 'GlowPill'

export { Button, GlowButton, buttonVariants, GlowPill }
