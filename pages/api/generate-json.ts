import { NextApiRequest, NextApiResponse } from "next"
import { loadSummarizationChain } from "langchain/chains"
import { JSONLoader } from "langchain/document_loaders"
import { OpenAI } from "langchain/llms"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const model = new OpenAI({ temperature: 0 })

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req

  // Check if the request method is POST
  if (method === "POST") {
    const { urls } = body

    const loader = new JSONLoader(
      "src/document_loaders/example_data/example.json",
      ["/owner", "/topics"]
    )

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2500,
      chunkOverlap: 200,
    })

    console.log(res)

    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ success: false, message: "Method not allowed" })
}
