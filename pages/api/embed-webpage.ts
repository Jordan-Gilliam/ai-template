import type { NextApiRequest, NextApiResponse, PageConfig } from "next"
import { createDocumentsFromUrl } from "@/loaders/document"
import { getFileText } from "@/loaders/parse"
import * as cheerio from "cheerio"
import { Document } from "langchain/document"
import { OpenAIEmbeddings } from "langchain/embeddings"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { PineconeStore } from "langchain/vectorstores"
import { Configuration, OpenAIApi } from "openai"
import { initPinecone } from "@/config/pinecone"

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openAi = new OpenAIApi(configuration)

if (
  !process.env.PINECONE_ENVIRONMENT ||
  !process.env.PINECONE_API_KEY ||
  !process.env.PINECONE_INDEX_NAME
) {
  throw new Error("Pinecone environment or api key vars missing")
}

// Embedding document sizes
const docSize = 1000

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
      const documents = await getDocumentsFromUrl(urls)
      // Process each document and store it in the database
      await storeDocumentsInPinecone(documents, namespaceConfig)

      return res.status(200).json({ success: true })
    } catch (error) {
      console.log("error", error)
      throw new Error("Failed to ingest your data")
    }
  }
}

async function getDocumentsFromUrl(urls: string[]) {
  const documents = []

  // Fetch and process the content of each URL
  for (const url of urls) {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    const text = $("body").text()

    const chunks = await splitDocumentsFromUrl(text, url)

    // Add the chunks to the documents array
    chunks.forEach((chunk) => documents.push(chunk))
  }

  return documents
}

async function splitDocumentsFromUrl(pageContent: string, url) {
  const rawDocs = new Document({
    pageContent,
    metadata: { source: url, type: "scrape" },
  })
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  })
  const docs = await textSplitter.splitDocuments([rawDocs])

  return docs
}

async function storeDocumentsInPinecone(docs: any, namespace) {
  const pinecone = await initPinecone()
  const embeddings = new OpenAIEmbeddings()
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME)

  const chunkSize = 50
  try {
    for (let i = 0; i < docs.length; i += chunkSize) {
      const chunk = docs.slice(i, i + chunkSize)

      // const dbStore = await PineconeStore.fromDocuments(
      //   index,
      //   chunk,
      //   embeddings,
      //   "text",
      //   namespace
      // )

      const vector = await PineconeStore.fromDocuments(chunk, embeddings, {
        pineconeIndex: index,
        namespace,
        textKey: "text",
      })

      return vector
    }
  } catch (error) {
    console.error("error in storeDocumentsInPinecone", error)
  }
}

// export const config: PageConfig = {
//   api: {
//     bodyParser: false,
//   },
// }

// export default handler

// import { z } from "zod"
// const ingestSchema = z.object({
//   namespace: z.string().optional(),
// })
