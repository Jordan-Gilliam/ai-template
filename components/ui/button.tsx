import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:ring-offset-2 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 disabled:opacity-50 dark:focus:ring-neutral-500/50 disabled:pointer-events-none dark:focus:ring-offset-neutral-900 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-neutral-800",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-neutral-50 dark:text-neutral-900",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600",
        outline:
          "bg-transparent border border-neutral-200 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100",
        subtle:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100",
        ghost:
          "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-100 dark:hover:text-neutral-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent",
        link: "bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-neutral-900 dark:text-neutral-100 hover:bg-transparent dark:hover:bg-transparent",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: 'h-8 w-8 p-0'
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

const GlowButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, disabled, size, ...props }, ref) => {
    return (
      <div
        className={cn(
          " relative w-full before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-teal-500/20 before:opacity-0   before:transition dark:before:border-teal-400/70 dark:before:ring-2 dark:before:ring-teal-900/40",
          " input-shadow-glow after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-white/5 after:transition",
          !disabled &&
            "focus-within:before:opacity-100 focus-within:after:shadow-teal-500/100 dark:after:shadow-white/5 dark:focus-within:after:shadow-teal-500/20",
          !disabled &&
            "hover:before:opacity-100 hover:after:shadow-teal-500/100  dark:hover:after:shadow-teal-500/20"
        )}
      >
        <button
          className={cn(
            "w-full font-semibold shadow-md",
            !disabled &&
              " focus:outline-none  focus:ring-1 focus:ring-inset focus:ring-neutral-800/10",
            !disabled &&
              " hover:outline-none  hover:ring-1 hover:ring-inset  hover:ring-neutral-800/10",
            "disabled:cursor-not-allowed disabled:opacity-80   sm:leading-6 ",
            "dark:border dark:border-black/40 ",
            " input-shadow rounded-lg  !outline-none",
            "relative border border-black/5 bg-white/80 px-3.5 py-2 text-black shadow-black/5 placeholder:text-neutral-800  focus:bg-white ",
            " dark:bg-black/60 dark:text-white dark:shadow-black/10 dark:placeholder:text-neutral-500",
            !disabled && "dark:hover:bg-black/70 dark:focus:bg-black/70",
            disabled && "cursor-default",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
GlowButton.displayName = "GlowButton"

export { Button, GlowButton, buttonVariants }
