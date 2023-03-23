import { ChatVectorDBQAChain } from "langchain/chains"
import { OpenAIChat } from "langchain/llms"
import { PineconeStore } from "langchain/vectorstores"

export const getResponseFromChain = async (
  vectorStore: PineconeStore,
  question: string,
  chatHistory?: string[]
) => {
  const model = new OpenAIChat({
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  const chain = ChatVectorDBQAChain.fromLLM(model, vectorStore)

  try {
    const response = await chain.call({
      question,
      max_tokens: 4000, // todo: pick up a sensible value
      temperature: 0,
      chat_history: chatHistory || [],
    })
    return response
  } catch (error) {
    console.log("error-get", error)
  }
}

export const getResponseFromCustomizedChain = async (
  vectorStore: PineconeStore,
  question: string,
  chatHistory?: string[]
) => {
  const model = new OpenAIChat({
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  const chain = ChatVectorDBQAChain.fromLLM(model, vectorStore)
  const response = await chain.call({
    question,
    max_tokens: 1000, // todo: pick up a sensible value
    temperature: 0,
    chat_history: chatHistory || [],
  })

  return response
}

// export const makeChain = (
//   vectorstore: SupabaseVectorStore,
//   onTokenStream?: (token: string) => void,
// ) => {
//   const questionGenerator = new LLMChain({
//     llm: new OpenAI({ temperature: 0 }),
//     prompt: CONDENSE_PROMPT,
//   });
//   const docChain = loadQAChain(
//     new OpenAI({
//       temperature: 0,
//       streaming: Boolean(onTokenStream),
//       callbackManager: {
//         handleNewToken: onTokenStream,
//       },
//     }),
//     { prompt: QA_PROMPT },
//   );

//   return new ChatVectorDBQAChain({
//     vectorstore,
//     combineDocumentsChain: docChain,
//     questionGeneratorChain: questionGenerator,
//   });
// };
