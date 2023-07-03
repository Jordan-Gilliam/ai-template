'use client'

import * as React from 'react'
import { ComponentProps, ReactNode } from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { Switch as AriaSwitch } from 'react-aria-components'
import { cn } from '@/lib/utils'

function Switch({
  children,
  ...props
}: { children: ReactNode } & ComponentProps<typeof AriaSwitch>) {
  return (
    <AriaSwitch
      {...props}
      className="group inline-flex touch-none items-center"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className="mr-4 h-6 w-9 cursor-pointer rounded-full border-2 border-transparent bg-zinc-600 ring-offset-2 ring-offset-zinc-900 transition duration-200 group-data-[selected]:bg-indigo-400 group-data-[focus-visible]:ring-2">
        <span className="block h-5 w-5 origin-right rounded-full bg-white shadow transition-all duration-200 group-data-[selected]:group-data-[pressed]:ml-2 group-data-[selected]:ml-3 group-data-[pressed]:w-6" />
      </span>
      <span>{children}</span>
    </AriaSwitch>
  )
}

// const Switch = React.forwardRef<
//   React.ElementRef<typeof SwitchPrimitives.Root>,
//   React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
// >(({ className, ...props }, ref) => (
//   <SwitchPrimitives.Root
//     className={cn(
//       "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-zinc-200 data-[state=checked]:bg-zinc-900 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900 dark:data-[state=unchecked]:bg-zinc-700 dark:data-[state=checked]:bg-zinc-400",
//       className
//     )}
//     {...props}
//     ref={ref}
//   >
//     <SwitchPrimitives.Thumb
//       className={cn(
//         "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5"
//       )}
//     />
//   </SwitchPrimitives.Root>
// ))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
