import { PineconeClient } from "@pinecone-database/pinecone"

export async function initPinecone() {
  try {
    const pinecone = new PineconeClient()

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? "", //this is in the dashboard
      apiKey: process.env.PINECONE_API_KEY ?? "",
    })

    return pinecone
  } catch (error) {
    console.log("error", error)
    throw new Error("Failed to initialize Pinecone Client")
  }
}
