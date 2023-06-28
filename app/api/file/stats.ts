import type { NextApiRequest, NextApiResponse } from "next"
import { initPinecone } from "@/config/pinecone"

if (
  !process.env.PINECONE_ENVIRONMENT ||
  !process.env.PINECONE_API_KEY ||
  !process.env.PINECONE_INDEX_NAME
) {
  throw new Error("Pinecone environment or api key vars missing")
}

// Embedding document sizes
export const config = {
  runtime: "edge",
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pinecone = await initPinecone()
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME)
    const indexDescription = await index.describeIndexStats({
      describeIndexStatsRequest: {},
    })
    const results = JSON.stringify({ indexDescription })
    // Process each document and store it in the database
    return new Response(results)
  } catch (error) {
    console.log("error", error)
    throw new Error("Failed to fetch Pinecone namespaces")
  }
}
