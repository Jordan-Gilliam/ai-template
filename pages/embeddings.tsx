import { useState } from "react"
import { NextPage } from "next"
import Image from "next/image"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useGenerateEmbeddings } from "@/hooks/use-generate-embeddings"
import { Loader2 } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

const Embeddings: NextPage = () => {
  const [urls, setUrls] = useState<string[]>([])

  const { loading, trigger } = useGenerateEmbeddings()

  console.log("load", loading)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!urls) {
      return toast.error("Please enter a url")
    }
    try {
      const result = await trigger({ urls })
      return result
    } catch (e) {
      return toast.error(e)
    }
  }

  return (
    <Layout>
      <div className="m-auto mt-6 flex max-w-xl flex-col items-center pb-12 text-center">
        <Image
          className=""
          height={250}
          width={250}
          src="/logo-down-violet.svg"
          alt="logo"
        />
        <h1 className="my-5 w-full font-aboreto text-2xl font-bold sm:text-4xl">
          Generate embeddings
        </h1>
        <p className="mb-4">
          Paste a list of comma separated URLs below to generate embeddings
          using the OpenAI API, and add the embeddings to the Supabase
          embeddings table.
        </p>
        <form onSubmit={handleSubmit}>
          <Textarea
            className=" h-[150px] w-[300px] border-2  border-mauve-9 shadow-sm placeholder:text-mauve-11 md:w-[750px]"
            placeholder="https://github.com/gannonh/gpt3.5-turbo-pgvector/blob/master/README.md, https://ui.shadcn.com/"
            value={urls.join("\n")}
            onChange={(e) => setUrls(e.target.value.split("\n"))}
          />

          <Button
            disabled={loading}
            type="submit"
            className="mt-6 max-w-lg"
            variant="default"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Embeddings
          </Button>
        </form>

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
      </div>
    </Layout>
  )
}

export default Embeddings
