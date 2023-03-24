import { Document } from "langchain/document"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

export type Message = {
  type: "apiMessage" | "userMessage"
  message: string
  isStreaming?: boolean
  sourceDocs?: Document[]
  question?: string
}
