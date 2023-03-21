import { ReactNode } from "react"
import rangeParser from "parse-numeric-range"
import ReactMarkdown from "react-markdown"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash"
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript"
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json"
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx"
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown"
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python"
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss"
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx"
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript"
import { synthwave84 } from "react-syntax-highlighter/dist/cjs/styles/prism"

SyntaxHighlighter.registerLanguage("tsx", tsx)
SyntaxHighlighter.registerLanguage("typescript", typescript)
SyntaxHighlighter.registerLanguage("scss", scss)
SyntaxHighlighter.registerLanguage("bash", bash)
SyntaxHighlighter.registerLanguage("markdown", markdown)
SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("python", python)
SyntaxHighlighter.registerLanguage("javascript", javascript)
SyntaxHighlighter.registerLanguage("jsx", jsx)

const syntaxTheme = synthwave84

const MarkdownComponents: object = {
  code({
    node,
    inline,
    className,
    ...props
  }: {
    node: { data: { meta: string } }
    inline: boolean
    className: string
  } & Record<string, unknown>): ReactNode {
    const match = /language-(\w+)/.exec(className || "")
    const hasMeta = node?.data?.meta

    const applyHighlights: object = (applyHighlights: number) => {
      if (hasMeta) {
        const RE = /{([\d,-]+)}/
        const metadata = node.data.meta?.replace(/\s/g, "")
        const strlineNumbers = RE?.test(metadata) ? RE?.exec(metadata)![1] : "0"
        const highlightLines = rangeParser(strlineNumbers)
        if (highlightLines.includes(applyHighlights)) {
          return { className: "highlight" }
        }
      }
      return {}
    }

    const children =
      typeof props.children === "string" || Array.isArray(props.children)
        ? props.children
        : ""

    return match ? (
      <SyntaxHighlighter
        style={syntaxTheme}
        customStyles={{ fontSize: "10px" }}
        language={match[1]}
        PreTag="div"
        className="codeStyle"
        showLineNumbers={true}
        wrapLines={true}
        wrapLongLines={true}
        useInlineStyles={true}
        lineProps={applyHighlights}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props} />
    )
  },
}

type Props = {
  content: string
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
  )
}

export default MarkdownRenderer
