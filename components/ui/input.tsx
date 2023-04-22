import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "w-full",
          " input-shadow-glow relative before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] ",
          "before:border before:border-indigo-500/40 before:opacity-0 before:ring-2 before:ring-indigo-300/20  before:transition ",
          "dark:before:border-teal-400/40 dark:before:ring-teal-900/20",
          " after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-white/5 after:transition",
          "focus-within:before:opacity-100 focus-within:after:shadow-indigo-500/100 dark:after:shadow-white/5 dark:focus-within:after:shadow-teal-500/20"
        )}
      >
        <input
          className={cn(
            " input-shadow rounded-lg  !outline-none",
            "relative border border-black/5 bg-white px-7 py-3.5 text-base shadow-black/5  placeholder:text-neutral-400 ",
            " dark:bg-black/80 dark:text-white dark:shadow-black/10 dark:placeholder:text-neutral-300 dark:focus:bg-black",
            className
          )}
          spellCheck={false}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

const InputButton = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="mt-2 flex w-full rounded-md ">
        <div
          className={cn(
            " relative w-full before:pointer-events-none before:absolute before:-inset-1 before:rounded-[9991px] before:border before:border-indigo-500/20 before:opacity-0 before:transition dark:before:border-teal-400/80 dark:before:ring-2 dark:before:ring-indigo-900/40",
            " input-shadow-glow after:pointer-events-none after:absolute after:inset-px after:rounded-[9987px] after:shadow-white/5 after:transition",
            "focus-within:before:opacity-100 focus-within:after:shadow-indigo-500/100 dark:after:shadow-white/5 dark:focus-within:after:shadow-teal-500/30"
          )}
        >
          <input
            type="search"
            autoComplete="false"
            className={cn(
              "w-full    pl-6 text-lg font-semibold",
              " focus:outline-none  focus:ring-2 focus:ring-inset focus:ring-mauve-2",
              "disabled:cursor-not-allowed disabled:opacity-50   sm:leading-6 ",
              "dark:border dark:border-black/40 ",
              " input-shadow rounded-[9988px]  !outline-none",
              "relative border border-black/5 bg-white/80 px-7 py-4  shadow-black/5 placeholder:text-neutral-400  focus:bg-white ",
              // " dark:bg-neutral-950/50 dark:text-neutral-200 dark:shadow-black/10 dark:placeholder:text-neutral-500",
              " dark:bg-black/80 dark:text-neutral-200 dark:shadow-black/10 dark:placeholder:text-neutral-500",
              "dark:focus:bg-black",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>

        {children}
      </div>
    )
  }
)

InputButton.displayName = "InputButton"

export { Input, InputButton }
