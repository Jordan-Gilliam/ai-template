import {
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts"

const CONDENSE_PROMPT = new PromptTemplate({
  template: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
  Chat History:
  {chat_history}
  Follow Up Input: {question}
  Standalone question:`,
  inputVariables: ["chat_history", "question"],
})

const QA_PROMPT = new PromptTemplate({
  template: `You are an AI assistant and a Notion expert. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
  You should only use hyperlinks as references that are explicitly listed as a source in the context below. Do NOT make up a hyperlink that is not listed below.
  If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
  If the question is not related to Notion, notion api or the context provided, politely inform them that you are tuned to only answer questions that are related to Notion.
  Choose the most relevant link that matches the context provided:
  Question: {question}
  =========
  {context}
  =========
  Answer in Markdown:`,
  inputVariables: ["question", "context"],
})

export { CONDENSE_PROMPT, QA_PROMPT }
