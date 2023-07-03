import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { FancyBackground } from '@/components/patterns'

export const runtime = 'edge'

export default function IndexPage() {
  const id = nanoid()

  return (
    // <FancyBackground>
    <Chat id={id} />
    // </FancyBackground>
  )
}
