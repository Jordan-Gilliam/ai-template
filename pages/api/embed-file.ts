import type { NextApiRequest, NextApiResponse, PageConfig } from "next"
import { OpenAIEmbeddings } from "langchain/embeddings"
import { PineconeStore } from "langchain/vectorstores"
import { initPinecone } from "@/config/pinecone"
import { getFileText, splitDocumentsFromFile } from "@/lib/file"

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
    // parse file -> text -> Document chunk & metadata -> store in Pinecone Namespace
    const fileText = await getFileText(req)
    const docs = await splitDocumentsFromFile(fileText)

    await storeDocumentsInPinecone(docs, namespaceConfig)
    res.status(200).json({ message: "Success" })
  } catch (error) {
    console.log("error", error)
    throw new Error("Failed to ingest your data")
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

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

export default handler
