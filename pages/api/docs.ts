import { OpenAIStream, OpenAIStreamPayload } from "@/lib/OpenAIStream"
import { supabaseClient } from "@/lib/embeddings-supabase"
// import { oneLine, stripIndent } from "common-tags";
import GPT3Tokenizer from "gpt3-tokenizer"
import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY })

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI")
}

export const config = {
  runtime: "edge",
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    console.log("req.method ", req.method)
    return new Response("ok", { headers: corsHeaders })
  }

  const { question } = (await req.json()) as {
    question?: string
  }

  if (!question) {
    return new Response("No prompt in the request", { status: 400 })
  }

  const query = question

  // OpenAI recommends replacing newlines with spaces for best results
  const input = query.replace(/\n/g, " ")
  console.log("input: ", input)

  const apiKey = process.env.OPENAI_API_KEY

  const embeddingResponse = await fetch(
    "https://api.openai.com/v1/embeddings",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        model: "text-embedding-ada-002",
      }),
    }
  )

  const embeddingData = await embeddingResponse.json()
  const [{ embedding }] = embeddingData.data
  console.log("embedding: ", embedding)

  const { data: documents, error } = await supabaseClient.rpc(
    "match_documents",
    {
      query_embedding: embedding,
      similarity_threshold: 0.1, // Choose an appropriate threshold for your data
      match_count: 10, // Choose the number of matches
    }
  )

  if (error) console.error(error)

  const tokenizer = new GPT3Tokenizer({ type: "gpt3" })
  let tokenCount = 0
  let contextText = ""

  console.log("documents: ", documents)

  // Concat matched documents
  if (documents) {
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i]
      const content = document.content
      const url = document.url
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.text.length

      // Limit context to max 1500 tokens (configurable)
      if (tokenCount > 1500) {
        break
      }

      contextText += `${content.trim()}\nSOURCE: ${url}\n---\n`
    }
  }

  console.log("contextText: ", contextText)

  const systemContent = `You are a the Ally Tech Blog GPT. When given CONTEXT you answer questions using only that information,
  and you always format your output in markdown. You include code snippets if relevant. If you are unsure and the answer
  is not explicitly written in the CONTEXT provided, you say
  "Sorry, I don't know how to help with that."  If the CONTEXT includes 
  source URLs include them under a SOURCES heading at the end of your response. Always include all of the relevant source urls 
  from the CONTEXT, but never list a URL more than once (ignore trailing forward slashes when comparing for uniqueness). Never include URLs that are not in the CONTEXT sections. Never make up URLs`

  const userContent = `CONTEXT:
  the Ally Tech Labs team utilizes foundational enterprise technologies and frameworks to ensure speed, quality, security, and risk are effectively managed. 
  SOURCE: ally.tech/innovating-at-the-speed-of-marketing-and-moving-at-the-speed-of-consumers-c150e7dcb3f7
  
  QUESTION: 
  What are some recent ally engineering innovations?    
  `

  const assistantContent = `Innovating at the Speed of Marketing and Moving at the Speed of Consumers

  
  SOURCES:
  https://ally.tech/innovating-at-the-speed-of-marketing-and-moving-at-the-speed-of-consumers-c150e7dcb3f7`

  const userMessage = `CONTEXT:
  ${contextText}
  
  USER QUESTION: 
  ${query}  
  `

  const messages = [
    {
      role: "system",
      content: systemContent,
    },
    {
      role: "user",
      content: userContent,
    },
    {
      role: "assistant",
      content: assistantContent,
    },
    {
      role: "user",
      content: userMessage,
    },
  ]

  // console.log("messages: ", messages);

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo-0301",
    messages: messages,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}

export default handler
