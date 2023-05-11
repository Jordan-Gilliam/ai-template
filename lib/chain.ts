import { CallbackManager } from "langchain/callbacks"
import { ChatVectorDBQAChain, LLMChain, loadQAChain } from "langchain/chains"
import { OpenAIChat } from "langchain/llms/openai"
import { PineconeStore } from "langchain/vectorstores/pinecone"
import { IMPROVED_QA_PROMPT, OPTIMIZED_CONDENSE_PROMPT } from "@/lib/prompts"

export const makePdfChain = (
  vectorstore: PineconeStore,
  onTokenStream?: (token: string) => void,
  sourceCount?: number
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAIChat({ temperature: 0 }),
    prompt: OPTIMIZED_CONDENSE_PROMPT,
  })
  const docChain = loadQAChain(
    new OpenAIChat({
      temperature: 0,
      modelName: "gpt-3.5-turbo", //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
      streaming: Boolean(onTokenStream),
      callbackManager: onTokenStream
        ? CallbackManager.fromHandlers({
            async handleLLMNewToken(token) {
              onTokenStream(token)
            },
          })
        : undefined,
    }),
    { prompt: IMPROVED_QA_PROMPT }
  )

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: true,
    k: !!sourceCount ? sourceCount : 2, //number of source documents to return
  })
}
