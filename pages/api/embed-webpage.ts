import type { NextApiRequest, NextApiResponse } from "next"
import { OpenAIEmbeddings } from "langchain/embeddings"
import { PineconeStore } from "langchain/vectorstores"
import { Configuration, OpenAIApi } from "openai"
import { initPinecone } from "@/config/pinecone"
import { getDocumentsFromUrl } from "@/lib/webpage"

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openAi = new OpenAIApi(configuration)

if (
  !process.env.PINECONE_ENVIRONMENT ||
  !process.env.PINECONE_API_KEY ||
  !process.env.PINECONE_INDEX_NAME
) {
  throw new Error("Pinecone environment or api key vars missing")
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, headers } = req
  if (method === "POST") {
    const { urls } = body
    const { namespace } = headers
    const namespaceConfig = !!namespace ? namespace : "default-namespace"

    try {
      // scrape url -> text -> Document chunk & metadata -> store in Pinecone Namespace
      const documents = await getDocumentsFromUrl(urls)

      await storeDocumentsInPinecone(documents, namespaceConfig)
      return res.status(200).json({ success: true })
    } catch (error) {
      console.log("error", error)
      throw new Error("Failed to ingest your data")
    }
  }
}

async function storeDocumentsInPinecone(docs: any, namespace) {
  const pinecone = await initPinecone()
  const embeddings = new OpenAIEmbeddings()
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME)

  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: index,
    namespace,
    textKey: "text",
  })
}
