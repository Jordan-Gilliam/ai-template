import {
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts"

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

const IMPROVED_CONDENSE_PROMPT = PromptTemplate.fromTemplate(
  `Your task as an AI language model is to create a clear and concise standalone question based on the given conversation history and a related follow-up question. Ensure that your rephrased question captures the essence of the follow-up question without relying on the context of the conversation.
System message: {system_message}
Conversation history:
{chat_history}
Related follow-up question: {question}
Rephrased standalone question:`
)

// - If you can't find the answer in the context, respond with "I'm sorry, but the information provided doesn't contain the answer you're looking for."
const IMPROVED_QA_PROMPT = PromptTemplate.fromTemplate(
  `As a highly advanced AI language model, your task is to provide a comprehensive and accurate response in a conversational manner, based on the context provided below. The following excerpt from a document is given, along with a question related to it. Please ensure that your answer is well-structured and directly addresses the question.
Guidelines:
- Use information from the provided context to support your answer. Do not include information from external sources.
- If the question is exactly "tl;dr" try your hardest to summarize the document in 100 words or less.
- If the question is unrelated to the context, kindly inform that your responses are limited to the information provided in the given context.


Question: {question}
=========
{context}
=========
Answer in Markdown format:`
)

const OPTIMIZED_CONDENSE_PROMPT = PromptTemplate.fromTemplate(
  `As an AI language model, your task is to create a clear, concise, and effective standalone question based on the conversation history and a related follow-up question provided below. Make sure your rephrased question captures the core intent of the follow-up question without relying on the conversation context.
Conversation history:
{chat_history}
Related follow-up question: {question}
Rephrased standalone question:`
)

const OPTIMIZED_QA_PROMPT = PromptTemplate.fromTemplate(
  `As an advanced AI language model, your goal is to provide a detailed, accurate, and conversational response to a question based on the context from a document excerpt provided below. Ensure your answer is well-structured and directly addresses the question.
System message: {system_message}
Guidelines:
- Rely solely on the provided context for your answer. Do not include information from external sources.
- If the answer cannot be found in the context, respond with "Unfortunately, the information provided doesn't contain the answer you're looking for."
- If the question is unrelated to the context, kindly mention that your ability to respond is limited to the context provided.

Question: {question}
=========
{context}
=========
Answer in Markdown format:`
)

export {
  CONDENSE_PROMPT,
  IMPROVED_CONDENSE_PROMPT,
  OPTIMIZED_CONDENSE_PROMPT,
  OPTIMIZED_QA_PROMPT,
  QA_PROMPT,
  IMPROVED_QA_PROMPT,
}
