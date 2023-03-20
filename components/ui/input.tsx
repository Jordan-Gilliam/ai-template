import * as React from "react"
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

export { Input }
