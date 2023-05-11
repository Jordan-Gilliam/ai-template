import type { NextApiRequest } from "next"
import formidable from "formidable"
import { Document } from "langchain/document"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import mammoth from "mammoth"
import { NodeHtmlMarkdown } from "node-html-markdown"
import pdfParse from "pdf-parse"
import { Writable } from "stream"
import Tesseract from "tesseract.js"

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 20_000_000,
  maxFieldsSize: 30_000_000,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: false,
}

export const getTextContentFromPDF = async (pdfBuffer) => {
  // TODO: pass metadata
  const { text, metadata } = await pdfParse(pdfBuffer)
  console.log("metadata", metadata)
  return text
}

export async function extractTextFromImage(imagePath) {
  return Tesseract.recognize(imagePath, "eng", {
    logger: (m) => console.log(m),
  }).then(({ data: { text } }) => {
    console.log(text)
    return text
  })
}

export const formidablePromise = (
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((accept, reject) => {
    const form = formidable(opts)

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      return accept({ fields, files })
    })
  })
}

export const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk)
      next()
    },
  })

  return writable
}

const convertFileToString = async (file: formidable.File, chunks) => {
  const fileData = Buffer.concat(chunks)

  let fileText = ""
  let docs

  switch (file.mimetype) {
    case "application/pdf":
      fileText = await getTextContentFromPDF(fileData)
      // docs = await createDocumentsFromPDFFile(file)
      break
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": // i.e. docx file
      const docxResult = await mammoth.extractRawText({
        buffer: fileData,
      })
      fileText = docxResult.value
      break
    // case "application/vnd.openxmlformats-officedocument.presentationml.presentation": // i.e. pptx file
    //   const pptResult = await extractTextFromPPTX(file.filepath)
    //   console.log(pptResult)
    //   fileText = pptResult.toString()
    //   break
    case "application/octet-stream":
      fileText = fileData.toString()
      break
    case "application/json":
      fileText = await fileData.toString()
      break
    case "text/markdown":
      fileText = await fileData.toString()
      break
    case "text/csv":
      break
    case "image/jpeg":
      fileText = await extractTextFromImage(fileData)
      break
    case "image/png":
      fileText = await extractTextFromImage(fileData)
      break
    case "text/html":
      const html = fileData.toString()
      const translatedHtml = NodeHtmlMarkdown.translate(html)
      fileText = translatedHtml
      break
    case "text/plain":
      fileText = fileData.toString()
      break
    default:
      throw new Error("Unsupported file type")
  }

  return {
    fileText,
    docs,
    fileName: file.originalFilename ?? "fallback-filename",
  }
}

export const getFileText = async (req: NextApiRequest) => {
  const chunks: never[] = []
  const { fields, files } = await formidablePromise(req, {
    ...formidableConfig,
    // consume this, otherwise formidable tries to save the file to disk
    fileWriteStreamHandler: () => fileConsumer(chunks),
  })

  const { file } = files

  return convertFileToString(file as formidable.File, chunks)
}

export const splitDocumentsFromFile = async (file) => {
  const { fileText, fileName } = file

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
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
