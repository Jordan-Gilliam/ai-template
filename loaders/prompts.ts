import {
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts"

// const CONDENSE_PROMPT = new PromptTemplate({
//   template: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
//   Chat History:
//   {chat_history}
//   Follow Up Input: {question}
//   Standalone question:`,
//   inputVariables: ["chat_history", "question"],
// })

// const QA_PROMPT = new PromptTemplate({
//   template: `You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
//   You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
//   If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
//   If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
//   Question: {question}
//   =========
//   {context}
//   =========
//   Answer in Markdown:`,
//   inputVariables: ["question", "context"],
// })

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`)

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
Question: {question}
=========
{context}
=========
Answer in Markdown:`
)

export { CONDENSE_PROMPT, QA_PROMPT }
