import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { InputButton } from "@/components/ui/input"

export function SearchInput({
  value,
  status,
  handleChange,
  handleClick,
  loading,
  placeholder,
}) {
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      return handleClick(e)
    }
  }

  return (
    <div className="flex w-full max-w-lg items-center space-x-2">
      <InputButton
        className=" relative rounded-full py-8 pr-16   ring-2 dark:ring-teal-900/20"
        value={value}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        placeholder={placeholder}
      >
        <div className="relative -ml-10 flex items-center justify-center">
          <div className="absolute  ml-4 w-14 rounded-r-full    ">
            <motion.button
              animate={status}
              initial={status}
              disabled={loading}
              type="submit"
              onClick={handleClick}
              className={cn(
                "group z-10 -ml-px inline-flex items-center rounded-full bg-mauve-1 p-3 text-sm",
                "font-semibold text-mauve-12 shadow-sm ring-1 ring-inset ring-mauve-8",
                "hover:ring-indigo-10 focus:scale-105 focus:shadow focus:outline-none focus:ring-2 focus:ring-inset  focus:ring-mauve-9 focus:transition focus:duration-300",
                "dark:hover:ring-mint-10 "
              )}
            >
              <AnimatePresence>
                {loading ? (
                  <Loader2 className="-ml-0.5 h-7 w-7 animate-spin text-indigo-9 group-hover:text-indigo-9 dark:text-mint-10 dark:group-hover:text-mint-9" />
                ) : status === "typing" || status === "idle" ? (
                  <PlusIcon
                    className="-ml-0.5 h-7 w-7 text-indigo-9 group-hover:text-indigo-9  dark:text-mint-10 dark:group-hover:text-mint-9"
                    aria-hidden="true"
                  />
                ) : (
                  <CheckIcon />
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </InputButton>
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      className="-ml-0.5 h-7 w-7 text-indigo-9 group-hover:text-indigo-9 dark:text-mint-10 dark:group-hover:text-mint-9"
      stroke="currentColor"
      strokeWidth={3}
    >
      <motion.path
        variants={checkIconVariants}
        transition={checkIconTransition}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <motion.line
        variants={checkIconVariants}
        transition={checkIconTransition}
        x1="12"
        y1="5"
        x2="12"
        y2="19"
      ></motion.line>
      <motion.line
        variants={checkIconVariants}
        transition={checkIconTransition}
        x1="5"
        y1="12"
        x2="19"
        y2="12"
      ></motion.line>
    </svg>
  )
}

let x = 1
const t = (v) => x * v

let checkIconTransition = {
  ease: "easeOut",
  type: "tween",
  delay: t(0.2),
  duration: t(0.3),
}
let checkIconVariants = {
  complete: {
    pathLength: [0, 1],
  },
}
