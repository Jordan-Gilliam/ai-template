import type { NextApiRequest, NextApiResponse } from "next"
import {
  LangChainStream,
  Message,
  OpenAIStream,
  StreamingTextResponse,
  streamToResponse,
} from "ai"
import { CallbackManager } from "langchain/callbacks"
import { ChatVectorDBQAChain, LLMChain, loadQAChain } from "langchain/chains"
import { ConversationalRetrievalQAChain } from "langchain/chains"
import { VectorDBQAChain } from "langchain/chains"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { OpenAI } from "langchain/llms/openai"
import { OpenAIChat } from "langchain/llms/openai"
import { BufferMemory } from "langchain/memory"
import { PineconeStore } from "langchain/vectorstores/pinecone"
import { initPinecone } from "@/config/pinecone"
import { makePdfChain } from "@/lib/chain"
import { IMPROVED_QA_PROMPT, OPTIMIZED_CONDENSE_PROMPT } from "@/lib/prompts"

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`

const QA_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:`

export const runtime = "edge"

export default async function POST(req: Request, res) {
  const { handlers, stream } = LangChainStream()

  const { messages, namespace } = await req.json()

  const aiAnswer = messages.filter((m) => m.role !== "user")
  const question = messages.filter((m) => m.role === "user")
  const currentQuestion = question.at(-1).content

  const pinecone = await initPinecone()
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME)
  const namespaceConfig = !!namespace ? namespace : "default-namespace"

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({}),
    {
      pineconeIndex: index,
      textKey: "text",
      // @ts-ignore
      namespace: namespaceConfig,
    }
  )

  const model = new OpenAI({
    temperature: 0,
    maxRetries: 2,
    streaming: true,
    modelName: "gpt-3.5-turbo", //change this to gpt-4 if you have access
    callbackManager: CallbackManager.fromHandlers(handlers),
  })

  // const nonStreamingModel = new ChatOpenAI()

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(3),
    {
      // qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
      questionGeneratorChainOptions: {
        // llm: nonStreamingModel,
        template: QA_PROMPT,
      },
      // memory: new BufferMemory({
      //   memoryKey: "chat_history",
      //   inputKey: "question",
      //   outputKey: "text",
      //   returnMessages: true,
      // }),
    }
  )

  // sendData(JSON.stringify({ question: sanitizedQuestion }))

  const callChain = await chain
    .call({
      question: question.at(-1).content,
      chat_history: [],
    })
    .catch(console.error)

  // console.log(JSON.stringify({ sourceDocs: callChain.sourceDocuments }))
  console.log(JSON.stringify({ content: callChain }))
  // const sendData = (data: string) => {
  //   res.write(`data: ${data}\n\n`)
  // }

  // await createChainAndSendResponse(req, res, vectorStore)

  return new StreamingTextResponse(stream)
}

// async function createChainAndSendResponse(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   vectorStore: any
// ) {
//   const { question, history } = req.body
//   const sanitizedQuestion = question.trim().replaceAll("\n", " ")

//   const sendData = (data: string) => {
//     res.write(`data: ${data}\n\n`)
//   }

//   sendData(JSON.stringify({ question: sanitizedQuestion }))
//   sendData(JSON.stringify({ data: "" }))

//   const chain = makePdfChain(vectorStore, (token: string) => {
//     sendData(JSON.stringify({ data: token }))
//   })

//   try {
//     await chain.call({
//       question: sanitizedQuestion,
//       chat_history: history || [],
//     })

//     sendData(JSON.stringify({ sourceDocs: response.sourceDocuments }))
//     // return new StreamingTextResponse(stream)
//   } catch (error) {
//     console.log("error", error)
//   } finally {
//     sendData("[DONE]")
//     res.end()
//   }
// }
