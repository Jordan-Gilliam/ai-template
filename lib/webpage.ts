import * as cheerio from "cheerio"
import { Document } from "langchain/document"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

async function splitDocumentsFromUrl(pageContent: string, url) {
  const rawDocs = new Document({
    pageContent,
    metadata: { source: url, type: "scrape" },
  })
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const docs = await textSplitter.splitDocuments([rawDocs])

  return docs
}

export async function getDocumentsFromUrl(urls: string[]) {
  const documents = []

  // Fetch and process the content of each URL
  for (const url of urls) {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    const text = $("body").text()

    const chunks = await splitDocumentsFromUrl(text, url)

    // Add the chunks to the documents array
    chunks.forEach((chunk) => documents.push(chunk))
  }

  return documents
}
