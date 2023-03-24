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

function buildScrapePrompt(question: string, contextText: string) {
  // systemContent: Instructions for the assistant on how to behave and respond
  const systemContent = `You are a helpful assistant. When given {context}, you answer questions using only that information,
    and you always format your output in markdown. You include code snippets if relevant. If you are unsure and the answer
    is not explicitly written in the {context} provided, you say
    "Sorry, I don't know how to help with that." If the {context} includes
    source URLs, include them under a SOURCES heading at the end of your response. Always include all of the relevant source URLs
    from the CONTEXT, but never list a URL more than once (ignore trailing forward slashes when comparing for uniqueness). Never include URLs that are not in the {context} sections. Never make up URLs`

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

export { CONDENSE_PROMPT, QA_PROMPT, buildScrapePrompt }
