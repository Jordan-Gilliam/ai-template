import { useState } from "react"
import { cn } from "@/lib/utils"

export type CardDetails = {
  name: string
  description: string
  items?: string[]
}

export const Card = ({
  cardDetails,
  children,
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
        "flex min-h-[350px] w-full flex-col items-center rounded-xl pt-7 md:w-full",
        "bg-transparent ring-inset ring-indigo-100/25 backdrop-blur dark:border-teal-500/50 dark:bg-neutral-800/30 ",
        {
          "border border-neutral-400/50 shadow-md transition duration-150 dark:border-neutral-500/30 ":
            !highlight,
          "shadow-box border border-teal-900/30 transition duration-150 ":
            highlight,
        }
      )}
    >
      <h2 className="flex-none px-4 text-xl font-semibold text-neutral-900 dark:text-white md:px-8 md:text-3xl">
        {cardDetails.name}
      </h2>
      <div className=" px-4 md:px-8">
        <p className="my-2 text-center text-base text-neutral-800 dark:text-neutral-100 md:text-lg">
          {cardDetails.description}
        </p>
      </div>

      <div className="mx-3 mt-2 px-3 backdrop-blur-none">{children}</div>
    </div>
  )
}
