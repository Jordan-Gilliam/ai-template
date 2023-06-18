import { CallbackManager } from "langchain/callbacks"
import { ChatVectorDBQAChain, LLMChain, loadQAChain } from "langchain/chains"
import { ConversationalRetrievalQAChain } from "langchain/chains"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { OpenAI } from "langchain/llms/openai"
import { OpenAIChat } from "langchain/llms/openai"
import { PineconeStore } from "langchain/vectorstores/pinecone"
import { IMPROVED_QA_PROMPT, OPTIMIZED_CONDENSE_PROMPT } from "@/lib/prompts"

// const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

// Chat History:
// {chat_history}
// Follow Up Input: {question}
// Standalone question:`

// const QA_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
// If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
// If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

// {context}

// Question: {question}
// Helpful answer in markdown:`

export const makePdfChain = (
  vectorstore: PineconeStore,
  handlers: any,
  sourceCount?: number
) => {
  const model = new OpenAI({
    temperature: 0,
    maxRetries: 2,
    streaming: true,
    modelName: "gpt-3.5-turbo", //change this to gpt-4 if you have access
    // callbackManager: CallbackManager.fromHandlers(handlers),
  })

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(3),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
    }
  )
  return chain
}
