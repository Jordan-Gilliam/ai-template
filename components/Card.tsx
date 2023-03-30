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
        "flex min-h-[350px] w-96 flex-col items-center rounded-2xl bg-transparent pt-7 backdrop-blur dark:border-black/30 dark:bg-neutral-800/30  md:w-full ",
        {
          "border border-neutral-900/50 shadow-lg transition duration-150 dark:border-neutral-700/50 ":
            !highlight,
          "shadow-box border border-teal-900/30  transition duration-150 ":
            highlight,
        }
      )}
    >
      <h2 className="flex-none px-4 text-3xl font-semibold text-neutral-700 dark:text-neutral-300 md:px-8">
        {cardDetails.name}
      </h2>
      <div className=" px-4 md:px-8">
        <p className="my-2 text-center text-lg dark:text-neutral-400">
          {cardDetails.description}
        </p>
      </div>

      <div className="mt-2 backdrop-blur-none">{children}</div>
    </div>
  )
}
