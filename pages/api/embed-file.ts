import type { NextApiRequest, NextApiResponse, PageConfig } from "next"
import { splitDocumentsFromFile } from "@/loaders/document"
import { getFileText } from "@/loaders/parse"
import { OpenAIEmbeddings } from "langchain/embeddings"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { PineconeStore } from "langchain/vectorstores"
import { initPinecone } from "@/config/pinecone"

if (
  !process.env.PINECONE_ENVIRONMENT ||
  !process.env.PINECONE_API_KEY ||
  !process.env.PINECONE_INDEX_NAME
) {
  throw new Error("Pinecone environment or api key vars missing")
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { namespace } = req.headers
  const namespaceConfig = !!namespace ? namespace : "default-namespace"

  try {
    const docs = await processDocuments(req)
    await storeDocumentsInPinecone(docs, namespaceConfig)
    res.status(200).json({ message: "Success" })
  } catch (error) {
    console.log("error", error)
    throw new Error("Failed to ingest your data")
  }
}

async function processDocuments(req: NextApiRequest) {
  const fileText = await getFileText(req)
  const rawDocs = await splitDocumentsFromFile(fileText)
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const docs = await textSplitter.splitDocuments(rawDocs)
  return docs
}

async function storeDocumentsInPinecone(docs: any, namespace) {
  const pinecone = await initPinecone()
  const embeddings = new OpenAIEmbeddings()
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME)

  const chunkSize = 50
  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize)

    // await PineconeStore.fromDocuments(
    //   index,
    //   chunk,
    //   embeddings,
    //   "text",
    //   namespace
    // )

    await PineconeStore.fromDocuments(chunk, embeddings, {
      pineconeIndex: index,
      namespace,
      textKey: "text",
    })
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

export default handler

// import { z } from "zod"
// const ingestSchema = z.object({
//   namespace: z.string().optional(),
// })
