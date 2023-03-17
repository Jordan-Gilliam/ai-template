import { useState } from "react"
import { NextPage } from "next"
import Image from "next/image"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const Embeddings: NextPage = () => {
  const [urls, setUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const response = await fetch("/api/generate-embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls }),
    })

    setLoading(false)

    if (!response.ok) {
      // Handle error
    }
  }

  return (
    <Layout>
      <div className="m-auto mt-6 flex max-w-xl flex-col items-center pb-12 text-center">
        <Image
          // className=" rotate-[60deg]"
          className=""
          height={250}
          width={250}
          src="/logo-down-violet.svg"
          alt="logo"
        />
        <h1 className="my-5 w-full text-2xl font-bold sm:text-4xl ">
          Generate embeddings
        </h1>
        <p className="mb-4">
          Paste a list of comma separated URLs below to generate embeddings
          using the OpenAI API, and add the embeddings to the Supabase
          embeddings table.
        </p>
        <form onSubmit={handleSubmit}>
          <Textarea
            className=" h-[250px] w-[300px] border-2  border-mauve-9 shadow-sm placeholder:text-mauve-11 md:w-[750px]"
            placeholder="https://github.com/gannonh/gpt3.5-turbo-pgvector/blob/master/README.md, https://ui.shadcn.com/"
            value={urls.join("\n")}
            onChange={(e) => setUrls(e.target.value.split("\n"))}
          />
          <Button className=" my-6" type="submit" disabled={loading}>
            Generate Embeddings
          </Button>
        </form>
        {loading && <div>Loading...</div>}
      </div>
    </Layout>
  )
}

export default Embeddings
