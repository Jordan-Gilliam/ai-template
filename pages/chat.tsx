import { PageLayout } from "@/components/Layouts"
import { Icons } from "@/components/icons"
import { Chat } from "@/components/query/Chat"

function ChatPage() {
  return (
    <PageLayout>
      <div className="mx-auto flex min-h-screen flex-col items-center  py-2">
        <main className="mx-auto  flex min-h-screen w-full flex-1 flex-col items-center  px-4 py-2 text-center sm:mt-12">
          <h1 className="mb-6 max-w-xl font-aboreto text-3xl font-bold sm:text-4xl">
            Ask me anything
          </h1>
          <div className="mx-auto w-full max-w-6xl">
            <Chat apiPath="chat" />
            <div className="mt-12 flex  items-center justify-end ">
              <Icons.mercury className="  fill-transparent stroke-mint-6 " />
              <Icons.mercury className="  fill-transparent stroke-mint-6" />
              <Icons.mercury className="fill-transparent stroke-mint-6" />
            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  )
}

export default ChatPage
