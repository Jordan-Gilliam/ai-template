import { NextApiRequest, NextApiResponse } from "next"
import { PineconeClient, Vector } from "@pinecone-database/pinecone"
import Bottleneck from "bottleneck"
import { OpenAIEmbeddings } from "langchain/embeddings"
import { PineconeStore } from "langchain/vectorstores"
import { initPinecone } from "@/config/pinecone"
import { splitDocumentsFromUrl } from "@/lib/webpage"
import { Crawler, Page } from "@/lib/webpage-crawler"

// Rate limiter to prevent overloading the server
const rateLimiter = new Bottleneck({
  minTime: 2000,
})

let pineconeClient: PineconeClient | null = null

// Initialize Pinecone client
const initializePineconeClient = async () => {
  pineconeClient = new PineconeClient()
  console.log("Pinecone client initialized")
  await pineconeClient.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  })
}

type ApiResponse = {
  message: string
}

// Splits an array into chunks
const chunkArray = (array: Vector[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) =>
    array.slice(i * chunkSize, (i + 1) * chunkSize)
  )
}

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (!process.env.PINECONE_INDEX_NAME) {
    res.status(500).json({ message: "PINECONE_INDEX_NAME not set" })
    return
  }

  const { body, headers } = req
  const { urls, limit } = body

  const { namespace } = headers
  const namespaceConfig = !!namespace ? namespace : "default-namespace"

  const crawlLimit = parseInt(limit as string) || 5

  if (!pineconeClient) {
    await initializePineconeClient()
  }

  const webpageCrawler = new Crawler(urls, crawlLimit, 200)
  const crawledPages = (await webpageCrawler.start()) as Page[]
  console.log(`${crawledPages.length} pages crawled`)

  // Split text into chunks
  const generateDocuments = await Promise.all(
    crawledPages.map((page) => {
      const documents = splitDocumentsFromUrl(page.text, page.url)

      return documents
    })
  )

  // Generate embeddings for the documents
  const flattenDocs = async () => {
    return await Promise.all(
      generateDocuments.flat().map(async (doc) => {
        return doc
      })
    )
  }

  let vectors: Vector[] = []

  try {
    vectors = (await rateLimiter.schedule(flattenDocs)) as unknown as Vector[]
  } catch (e) {
    res.status(500).json({ message: JSON.stringify(e) })
    return
  }

  const vectorChunks = chunkArray(vectors, 10)

  // Insert or update the vectors in the Pinecone index
  await Promise.all(
    vectorChunks.map(async (chunk) => {
      await storeDocumentsInPinecone(chunk, namespaceConfig)
    })
  )

  res.status(200).json({ message: "Done" })
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
