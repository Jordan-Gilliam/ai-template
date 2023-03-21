import { NextApiRequest, NextApiResponse } from "next"
import * as cheerio from "cheerio"
import { Configuration, OpenAIApi } from "openai"
import { supabaseClient } from "@/lib/embeddings-supabase"

// Embedding document sizes
const docSize = 1000

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openAi = new OpenAIApi(configuration)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req

  // Check if the request method is POST
  if (method === "POST") {
    const { urls } = body
    const documents = await getDocuments(urls)

    // Process each document and store it in the database
    for (const { url, body } of documents) {
      await processAndStoreDocument(url, body)
    }

    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ success: false, message: "Method not allowed" })
}

async function getDocuments(urls: string[]) {
  const documents = []

  // Fetch and process the content of each URL
  for (const url of urls) {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    const articleText = $("body").text()

    // Divide the content into chunks of the defined document size
    const chunks = splitTextIntoChunks(articleText, docSize)

    // Add the chunks to the documents array
    chunks.forEach((chunk) => documents.push({ url, body: chunk }))
  }

  return documents
}

function splitTextIntoChunks(text: string, chunkSize: number) {
  const chunks = []
  let start = 0

  while (start < text.length) {
    const end = start + chunkSize
    const chunk = text.slice(start, end)
    chunks.push(chunk)
    start = end
  }

  return chunks
}

async function processAndStoreDocument(url: string, input: string) {
  console.log("\nDocument length: \n", input.length)
  console.log("\nURL: \n", url)

  const embeddingResponse = await openAi.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  })

  console.log("\nembeddingResponse: \n", embeddingResponse)

  const [{ embedding }] = embeddingResponse.data.data

  // In production, handle possible errors
  await supabaseClient.from("documents").insert({
    content: input,
    embedding,
    url,
  })
}
