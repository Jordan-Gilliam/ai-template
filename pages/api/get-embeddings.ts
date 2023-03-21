import GPT3Tokenizer from "gpt3-tokenizer"
import { Configuration } from "openai"
import { OpenAIStream, OpenAIStreamPayload } from "@/lib/OpenAIStream"
import { supabaseClient } from "@/lib/embeddings-supabase"

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

export default async function handler(req: Request) {
  // const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const { question } = (await req.json()) as { question?: string }

  if (!question) {
    return new Response("No prompt in the request", { status: 400 })
  }

  const input = question.replace(/\n/g, " ")
  const embedding = await getEmbedding(input)
  const documents = await matchDocuments(embedding)
  const contextText = buildContextText(documents)

  const messages = buildMessages(question, contextText)
  const payload: OpenAIStreamPayload = createPayload(messages)

  const stream = await OpenAIStream(payload)

  return new Response(stream)
}

async function getEmbedding(input: string) {
  const apiKey = process.env.OPENAI_API_KEY
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input,
      model: "text-embedding-ada-002",
    }),
  })

  const { data } = await response.json()
  const [{ embedding }] = data
  return embedding
}

async function matchDocuments(embedding: number[]) {
  const { data: documents, error } = await supabaseClient.rpc(
    "match_documents",
    {
      query_embedding: embedding,
      similarity_threshold: 0.1,
      match_count: 10,
    }
  )

  if (error) console.error(error)
  return documents
}

function buildContextText(documents: any[]) {
  const tokenizer = new GPT3Tokenizer({ type: "gpt3" })
  let tokenCount = 0
  let contextText = ""

  if (documents) {
    for (const document of documents) {
      const content = document.content
      const url = document.url
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.text.length

      if (tokenCount > 1500) {
        break
      }

      contextText += `${content.trim()}\nSOURCE: ${url}\n---\n`
    }
  }

  return contextText
}

function buildMessages(question: string, contextText: string) {
  // systemContent: Instructions for the assistant on how to behave and respond
  const systemContent = `You are a helpful assistant. When given CONTEXT, you answer questions using only that information,
    and you always format your output in markdown. You include code snippets if relevant. If you are unsure and the answer
    is not explicitly written in the CONTEXT provided, you say
    "Sorry, I don't know how to help with that." If the CONTEXT includes
    source URLs, include them under a SOURCES heading at the end of your response. Always include all of the relevant source URLs
    from the CONTEXT, but never list a URL more than once (ignore trailing forward slashes when comparing for uniqueness). Never include URLs that are not in the CONTEXT sections. Never make up URLs`

  // userContent: A sample of the user's input with context
  const userSampleQuestion = `CONTEXT:
    Next.js is a React framework for creating production-ready web applications. It provides a variety of methods for fetching data, a built-in router, and a Next.js Compiler for transforming and minifying JavaScript code. It also includes a built-in Image Component and Automatic Image Optimization for resizing, optimizing, and serving images in modern formats.
    SOURCE: nextjs.org/docs/faq
    
    QUESTION: 
    what is nextjs?`

  // assistantContent: A sample of the assistant's response to the user's question
  const assistantSampleAnswer = `Next.js is a framework for building production-ready web applications using React. It offers various data fetching options, comes equipped with an integrated router, and features a Next.js compiler for transforming and minifying JavaScript. Additionally, it has an inbuilt Image Component and Automatic Image Optimization that helps resize, optimize, and deliver images in modern formats.
  
    \`\`\`js
    function HomePage() {
      return <div>Welcome to Next.js!</div>
    }
    
    export default HomePage
    \`\`\`
    
    SOURCES:
    https://nextjs.org/docs/faq`

  // userMessage: The user's input for the current question with context
  const userMessage = `CONTEXT:
    ${contextText}
    
    USER QUESTION: 
    ${question}`

  return [
    {
      role: "system",
      content: systemContent,
    },
    {
      role: "user",
      content: userSampleQuestion,
    },
    {
      role: "assistant",
      content: assistantSampleAnswer,
    },
    {
      role: "user",
      content: userMessage,
    },
  ]
}

function createPayload(messages: any[]): OpenAIStreamPayload {
  return {
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
}
