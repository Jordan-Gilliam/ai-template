import { PineconeClient } from "@pinecone-database/pinecone"
import { Document } from "langchain/document"
import { OpenAIEmbeddings } from "langchain/embeddings"
import { PineconeStore } from "langchain/vectorstores"

const PINECONE_INDEX_NAME = "mercury"
const SMART_DOCU_INDEX_NAME = "smart-docus"

export const storeDocsInPineconeStore = async (
  docs: Document[],
  namespace?: string
) => {
  const pinecone = new PineconeClient()

  await pinecone.init({
    // environment: namespace ? "us-central1-gcp" : "us-east1-gcp",
    environment: "us-central1-gcp",
    apiKey: process.env.PINECONE_API_KEY,
  })

  const index = pinecone.Index("mercury")
  await PineconeStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    {
      pineconeIndex: index,
      namespace,
    }
  )
}

export const getVectorFromPineconeStore = async (namespace?: string) => {
  const pinecone = new PineconeClient()

  await pinecone.init({
    environment: "us-central1-gcp",
    apiKey: process.env.PINECONE_API_KEY,
  })

  const index = pinecone.Index("mercury")
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    {
      pineconeIndex: index,
      namespace,
    }
  )

  return vectorStore
}
