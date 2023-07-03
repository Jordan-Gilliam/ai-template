import type { NextApiRequest, NextApiResponse } from 'next'
import { kv } from '@vercel/kv'

import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

import {
  createCallbacksTransformer,
  type AIStreamCallbacks,
  Message,
  LangChainStream,
  OpenAIStream,
  StreamingTextResponse,
  streamToResponse
} from 'ai'
import { CallbackManager } from 'langchain/callbacks'
import { ChatVectorDBQAChain, LLMChain, loadQAChain } from 'langchain/chains'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { VectorDBQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { OpenAI } from 'langchain/llms/openai'
import { OpenAIChat } from 'langchain/llms/openai'
import { BufferMemory } from 'langchain/memory'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { initPinecone } from '@/config/pinecone'
import { makePdfChain } from '@/lib/chain'
import { IMPROVED_QA_PROMPT, OPTIMIZED_CONDENSE_PROMPT } from '@/lib/prompts'

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

export const runtime = 'edge'

function LangChainStream2(callbacks?: AIStreamCallbacks) {
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  const runMap = new Set()

  const endStream = async () => {
    if (runMap.size === 0) {
      await writer.ready
      await writer.close()
    }
    console.log(runMap)
  }

  return {
    stream: stream.readable.pipeThrough(createCallbacksTransformer(callbacks)),
    handlers: {
      handleLLMStart: async (_llm, _prompts: string[], runId: string) => {
        runMap.add(runId)
      },
      handleLLMNewToken: async (token: string) => {
        await writer.ready
        await writer.write(token)
      },
      handleLLMError: async (e: any, runId: string) => {
        runMap.delete(runId)
        await writer.ready
        await writer.abort(e)
      },
      handleLLMEnd: async (_output, runId: string) => {
        runMap.delete(runId)
        await endStream()
      },
      handleChatModelStart: async (_llm, _messages, runId: string) => {
        runMap.add(runId)
      },
      handleChatModelEnd: async (_output, runId: string) => {
        runMap.delete(runId)

        await endStream()
      },
      handleChainStart: async (_chain, _inputs, runId: string) => {
        runMap.add(runId)
      },
      handleChainError: async (e, runId: string) => {
        runMap.delete(runId)

        await writer.ready
        await writer.abort(e)
      },
      handleChainEnd: async (_outputs, runId: string) => {
        runMap.delete(runId)

        await endStream()
      },
      handleToolStart: async (_tool, _input: string, runId: string) => {
        runMap.add(runId)
      },
      handleToolError: async (error: Error, runId: string) => {
        runMap.delete(runId)

        await writer.ready
        await writer.abort(error)
      },
      handleToolEnd: async (_output: string, runId: string) => {
        runMap.delete(runId)

        await endStream()
      },
      handleAgentAction: async (_action, runId: string) => {
        runMap.add(runId)
      },
      handleAgentEnd: async (_output, runId: string) => {
        runMap.delete(runId)

        await endStream()
      }
    }
  }
}

export async function POST(req: Request, res) {
  const json = await req.json()
  const { messages, namespace } = json

  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const { stream, handlers } = LangChainStream({
    onStart: async () => console.log('start'),
    onToken: async token => console.log(token),
    onCompletion: async completion => {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const sourceDocs = completion
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        sourceDocs,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      console.log(payload)

      //   await kv.hmset(`chat:${id}`, payload)
      //   await kv.zadd(`user:chat:${userId}`, {
      //     score: createdAt,
      //     member: `chat:${id}`
      //   })
    }
  })

  const aiAnswer = messages.filter(m => m.role !== 'user')
  const question = messages.filter(m => m.role === 'user')
  const currentQuestion = question.at(-1).content

  const pinecone = await initPinecone()
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME)
  const namespaceConfig = !!namespace ? namespace : 'default-namespace'

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({}),
    {
      pineconeIndex: index,
      textKey: 'text',
      // @ts-ignore
      namespace: 'any'
    }
  )

  const model = new OpenAI({
    temperature: 0,
    maxRetries: 2,
    streaming: true,
    verbose: true,
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
    callbackManager: CallbackManager.fromHandlers(handlers)
  })

  //   const nonStreamingModel = new ChatOpenAI()

  // const nonStreamingModel = new ChatOpenAI()

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(1),
    {
      verbose: true,
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
      questionGeneratorChainOptions: {
        // llm: nonStreamingModel,
        template: QA_PROMPT
      }
      //   questionGeneratorChainOptions: {
      //     // llm: nonStreamingModel,
      //     // template: QA_PROMPT
      //   }
      // memory: new BufferMemory({
      //   memoryKey: "chat_history",
      //   inputKey: "question",
      //   outputKey: "text",
      //   returnMessages: true,
      // }),
    }
  )

  // sendData(JSON.stringify({ question: sanitizedQuestion }))

  //   const question = messages[messages.length - 1].content

  const call = chain
    .call({
      question: question.at(-1).content,
      chat_history: []
    })
    .catch(console.error)
    .finally(() => {
      // Call handleStreamEnd when the chat or stream ends

      handlers.handleChainEnd()
    })

  console.log(call)
  //   const sourceDocs = streamToResponse()

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
