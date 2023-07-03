import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { InputButton } from '@/components/ui/input'

type SearchProps = {
  value: string
  status: string
  handleChange: (e: any) => void
  handleClick: (e: any) => void
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
  className
}: SearchProps) {
  const { formRef, onKeyDown } = useEnterSubmit()

  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="flex w-full max-w-lg items-center space-x-2">
      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          if (value === '') {
            return
          }
          handleChange('')
          await handleClick(value)
        }}
        className="w-full"
        ref={formRef}
      >
        <InputButton
          // @ts-ignore
          onKeyDown={onKeyDown}
          className={cn('relative py-5 pr-10 ', className)}
          value={value}
          tabIndex={0}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target.value)
          }
          placeholder={placeholder}
          enterKeyHint="go"
          // @ts-ignore
          ref={inputRef}
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
                  'group z-10 inline-flex items-center justify-center rounded-full bg-mauve-1 p-3 text-sm md:block',
                  'font-semibold text-mauve-12 shadow-sm ring-1 ring-inset ring-mauve-6',
                  'hover:scale-105 hover:shadow hover:ring-inset hover:ring-mauve-7 hover:transition hover:duration-300',
                  'focus:scale-105 focus:shadow focus:outline-none focus:ring-inset focus:ring-mauve-8 focus:transition focus:duration-300',
                  'dark:ring-mauve-6 dark:hover:shadow-[#1B1B25] dark:hover:ring-mauve-8'
                )}
              >
                <AnimatePresence>
                  {loading ? (
                    <Icons.loadingSpinner className="-ml-0.5 h-7 w-7 animate-spin text-indigo-500/80 group-hover:text-indigo-500 dark:text-indigo-400 dark:group-hover:text-indigo-300" />
                  ) : !!value ? (
                    <Icons.plus
                      className="-ml-0.5 h-7 w-7"
                      aria-hidden="true"
                    />
                  ) : (
                    <Icons.check className="-ml-0.5 h-7 w-7" />
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </InputButton>
      </form>
    </div>
  )
}
