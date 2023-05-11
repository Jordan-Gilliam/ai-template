import { FC, ReactNode } from "react"
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
import remarkGfm from "remark-gfm"

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
        customStyles={{ fontSize: "8px" }}
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
  className?: string
  isCurrent?: boolean
}

const MarkdownRenderer2: React.FC<Props> = ({ content, className }) => {
  return (
    <ReactMarkdown className={className} components={MarkdownComponents}>
      {content}
    </ReactMarkdown>
    // <SyntaxHighlighter className={className} components={MarkdownComponents}>
    //   {content}
    // </SyntaxHighlighter>
  )
}

const Caret = () => {
  return (
    <i className=" inline-block h-[1px] w-[5px] translate-x-[2px] translate-y-[2px] rounded-[1px] bg-teal-500 shadow-[0_0px_3px_0px_rgba(217,70,219,0.9)]" />
  )
}

type WithCaretProps = {
  Component: string
  children?: ReactNode
  isCurrent?: boolean
} & any

const WithStyle: FC<WithCaretProps> = ({
  isCurrent,
  Component,
  children,
  ...rest
}) => {
  // Sometimes, react-markdown sends props of incorrect type,
  // causing React errors. To be safe, we normalize them here.
  const stringifiedProps = Object.keys(rest).reduce((acc, key) => {
    const value = rest[key]
    if (value === null || typeof value === "undefined") {
      return acc
    }
    return {
      ...acc,
      key: typeof value !== "string" ? value.toString() : value,
    }
  }, {})

  return (
    <Component {...stringifiedProps} className="markdown-node">
      {children}
      <Caret />
    </Component>
  )
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-full dark:prose-invert">
      <ReactMarkdown
        components={{
          p: (props) => <WithStyle Component="p" {...props} />,
          span: (props) => <WithStyle Component="span" {...props} />,
          h1: (props) => <WithStyle Component="h1" {...props} />,
          h2: (props) => <WithStyle Component="h2" {...props} />,
          h3: (props) => <WithStyle Component="h3" {...props} />,
          h4: (props) => <WithStyle Component="h4" {...props} />,
          h5: (props) => <WithStyle Component="h5" {...props} />,
          h6: (props) => <WithStyle Component="h6" {...props} />,
          pre: (props) => <WithStyle Component="pre" {...props} />,
          code: (props) => <WithStyle Component="code" {...props} />,
          td: (props) => <WithStyle Component="td" {...props} />,
          li: (props) => <WithStyle Component="li" {...props} />,
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
