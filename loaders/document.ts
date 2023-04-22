// https://github.com/CarlosZiegler/pdf-gpt3/providers/document.provider.ts
import { loadSummarizationChain } from "langchain/chains"
import { Document } from "langchain/document"
import {
  CSVLoader,
  JSONLoader,
  TextLoader,
  UnstructuredLoader,
} from "langchain/document_loaders"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio"
import { OpenAI } from "langchain/llms/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

// TODO - currently v expensive
const summarizeDocs = async (file) => {
  const { fileText, docs } = file

  const textSplitterSummary = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
  })
  const summaryDocs = await textSplitterSummary.createDocuments([fileText])
  const model = new OpenAI({
    temperature: 0,
  })
  const chain = loadSummarizationChain(model)
  const res = await chain.call({
    input_documents: summaryDocs,
  })
  console.log(res)
  return res
}

export const splitDocumentsFromFile = async (file) => {
  const { fileText, fileName } = file

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  })
  const docOutput = await textSplitter.splitDocuments([
    new Document({
      pageContent: fileText,
      metadata: { source: fileName, type: "file" },
    }),
  ])

  return docOutput
}

export const createDocumentsFromUrl = async (url: string) => {
  const loader = new CheerioWebBaseLoader(url)
  const docs = await loader.load()
  return docs
}

export const createDocumentsFromPPT = async (
  webPath?: string | Buffer,
  file?: string
) => {
  // @ts-ignore
  const loader = new UnstructuredLoader(webPath, file)
  const docs = await loader.load()
  console.log(docs)
  return docs
}

export const createDocumentsFromJsonFile = async (url: string) => {
  const loader = new JSONLoader(
    "src/document_loaders/example_data/example.json",
    "/texts"
  )
  const docs = await loader.load()
  return docs
}

// TODO
export const createDocumentsFromCSVFile = async (url: string) => {
  const loader = new CSVLoader(
    "src/document_loaders/example_data/example.csv",
    "text"
  )
  const docs = await loader.load()
  return docs
}

export const createDocumentsFromPDFFile = async (file: any) => {
  const splitDataURI = file.split(",")
  splitDataURI.pop()
  const bf = Buffer.from(splitDataURI.pop() || "", "base64")
  const blob = new Blob([bf])
  // const loader = new PDFLoader(blob)
  const loader = new PDFLoader(blob, {
    splitPages: false,
    pdfjs: () => import("pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js"),
  })
  const docs = await loader.load()
  return docs
}

export const createDocumentsFromTxtFile = async (file: string) => {
  const loader = new TextLoader(file)
  const docs = await loader.load()
  return docs
}
