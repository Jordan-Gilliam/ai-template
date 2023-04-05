// https://github.com/CarlosZiegler/pdf-gpt3/providers/document.provider.ts
import { Document } from "langchain/document"
import {
  CSVLoader,
  CheerioWebBaseLoader,
  JSONLoader,
  PDFLoader,
  TextLoader,
  UnstructuredLoader,
} from "langchain/document_loaders"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

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

export const createDocumentsFromPDFFile = async (json: any) => {
  const loader = new PDFLoader(json)
  const docs = await loader.load()
  return docs
}

export const createDocumentsFromTxtFile = async (file: string) => {
  const loader = new TextLoader(file)
  const docs = await loader.load()
  return docs
}
