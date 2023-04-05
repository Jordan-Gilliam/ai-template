import { AnimatePresence, motion } from "framer-motion"
import { Loader } from "lucide-react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { InputButton } from "@/components/ui/input"

type SearchProps = {
  value: string
  status: string
  handleChange: (e) => void
  handleClick: (e) => void
  loading: boolean
  placeholder: string
  className?: string
}

export function SearchInput({
  value,
  status,
  handleChange,
  handleClick,
  loading,
  placeholder,
  className,
}: SearchProps) {
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      return handleClick(e)
    }
  }

  return (
    <div className="flex w-full max-w-lg items-center space-x-2">
      <InputButton
        className={cn("relative  py-5 pr-10  ", className)}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        placeholder={placeholder}
        enterKeyHint="go"
      >
        <div className="relative -ml-10 hidden items-center justify-center md:flex">
          <div className="absolute ml-4 w-14 rounded-r-full">
            <motion.button
              animate={status}
              initial={status}
              disabled={loading}
              type="submit"
              onClick={handleClick}
              className={cn(
                "group z-10 inline-flex items-center justify-center rounded-full bg-mauve-1 p-3 text-sm md:block",
                "font-semibold text-mauve-12 shadow-sm ring-1 ring-inset ring-mauve-6",
                "hover:scale-105 hover:shadow hover:ring-inset hover:ring-mauve-7 hover:transition hover:duration-300",
                "focus:scale-105 focus:shadow focus:outline-none focus:ring-inset focus:ring-mauve-8 focus:transition focus:duration-300",
                "dark:ring-mauve-6 dark:hover:shadow-[#1B1B25] dark:hover:ring-mauve-8"
              )}
            >
              <AnimatePresence>
                {loading ? (
                  <Icons.loadingSpinner className="-ml-0.5 h-7 w-7 animate-spin text-teal-500/80 group-hover:text-teal-500  dark:text-teal-400 dark:group-hover:text-teal-300" />
                ) : status === "typing" || status === "idle" ? (
                  <Icons.plus className="-ml-0.5 h-7 w-7" aria-hidden="true" />
                ) : (
                  <Icons.check className="-ml-0.5 h-7 w-7" />
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </InputButton>
    </div>
  )
}

// function CheckIcon(props) {
//   return (
//     <svg
//       {...props}
//       fill="none"
//       viewBox="0 0 24 24"
//       className="-ml-0.5 h-7 w-7 text-teal-400/80 group-hover:text-teal-500  dark:text-teal-400 dark:group-hover:text-teal-300"
//       stroke="currentColor"
//       strokeWidth={3}
//     >
//       <motion.path
//         variants={checkIconVariants}
//         transition={checkIconTransition}
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M5 13l4 4L19 7"
//       />
//     </svg>
//   )
// }

// function PlusIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       className="-ml-0.5 h-7 w-7 text-teal-400/80 group-hover:text-teal-500  dark:text-teal-400 dark:group-hover:text-teal-300"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <motion.line
//         variants={checkIconVariants}
//         transition={checkIconTransition}
//         x1="12"
//         y1="5"
//         x2="12"
//         y2="19"
//       ></motion.line>
//       <motion.line
//         variants={checkIconVariants}
//         transition={checkIconTransition}
//         x1="5"
//         y1="12"
//         x2="19"
//         y2="12"
//       ></motion.line>
//     </svg>
//   )
// }

// let x = 1
// const t = (v) => x * v

// let checkIconTransition = {
//   ease: "easeOut",
//   type: "tween",
//   delay: t(0.2),
//   duration: t(0.3),
// }
// let checkIconVariants = {
//   complete: {
//     pathLength: [0, 1],
//   },
// }
