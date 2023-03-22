import * as React from "react"
import { BookIcon, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-14 w-full rounded-md border-2 border-mauve-10 bg-transparent py-2 px-3 text-sm placeholder:text-mauve-11 focus:outline-none focus:ring-2  focus:ring-mauve-1 focus:ring-offset-2 focus:ring-offset-mauve-8 disabled:cursor-not-allowed disabled:opacity-50 dark:text-mauve-12",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const InputButton = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="mt-2 flex w-full rounded-md ">
        <div className="relative w-full focus-within:z-10">
          <input
            className={cn(
              "block h-14 w-full rounded-l-full border-2 border-mauve-10 bg-transparent py-1.5 pl-10 text-mauve-12 shadow-sm ring-1 ring-inset ring-mauve-3 placeholder:text-mauve-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mauve-1 disabled:cursor-not-allowed disabled:opacity-50 dark:text-mauve-12 sm:text-sm sm:leading-6",
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
