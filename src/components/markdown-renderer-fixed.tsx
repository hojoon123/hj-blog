"use client"

import type React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import remarkEmoji from "remark-emoji"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { useTheme } from "@/contexts/theme-context"
import { Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Components } from "react-markdown"

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 수정된 CodeBlockProps - children을 optional로 변경
interface CodeBlockProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

interface CopyButtonProps {
  text: string
}

// 복사 버튼 컴포넌트
function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      title="코드 복사"
      type="button"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

// 수정된 코드 블록 컴포넌트
function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
  const { theme } = useTheme()
  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ""
  const codeString = String(children || "").replace(/\n$/, "")

  if (inline) {
    return (
      <code
        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 rounded text-sm font-mono border"
        {...props}
      >
        {children}
      </code>
    )
  }

  return (
    <div className="relative group my-6">
      {/* 언어 라벨 */}
      {language && (
        <div className="absolute top-0 left-4 -translate-y-1/2 px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs font-medium rounded-full">
          {language}
        </div>
      )}

      {/* 복사 버튼 */}
      <CopyButton text={codeString} />

      {/* 코드 하이라이터 */}
      <SyntaxHighlighter
        style={theme === "dark" ? oneDark : oneLight}
        language={language || "text"}
        PreTag="div"
        className="!mt-0 !mb-0 rounded-lg border border-gray-200 dark:border-gray-700"
        showLineNumbers={codeString.split("\n").length > 5}
        wrapLines={true}
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  )
}

// 타입 안전한 이미지 처리 함수
function isValidImageSrc(src: unknown): src is string {
  return typeof src === "string" && src.length > 0
}

// 커스텀 컴포넌트들
const components: Components = {
  // 코드 블록
  code: CodeBlock,

  // 헤딩에 앵커 링크 추가
  h1: ({ children, id }) => (
    <h1 id={id} className="group text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white scroll-mt-20">
      {children}
      {id && (
        <Link
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-600 transition-opacity"
          aria-label="링크 복사"
        >
          <ExternalLink className="w-5 h-5 inline" />
        </Link>
      )}
    </h1>
  ),

  h2: ({ children, id }) => (
    <h2 id={id} className="group text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white scroll-mt-20">
      {children}
      {id && (
        <Link
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-600 transition-opacity"
          aria-label="링크 복사"
        >
          <ExternalLink className="w-4 h-4 inline" />
        </Link>
      )}
    </h2>
  ),

  h3: ({ children, id }) => (
    <h3 id={id} className="group text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white scroll-mt-20">
      {children}
      {id && (
        <Link
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-600 transition-opacity"
          aria-label="링크 복사"
        >
          <ExternalLink className="w-3 h-3 inline" />
        </Link>
      )}
    </h3>
  ),

  // 단락
  p: ({ children }) => <p className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">{children}</p>,

  // 링크 - 타입 안전성 개선
  a: ({ href, children }) => {
    const isExternal = typeof href === "string" && href.startsWith("http")
    const linkClass =
      "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {children}
          <ExternalLink className="w-3 h-3 inline ml-1" />
        </a>
      )
    }

    return (
      <Link href={href || "#"} className={linkClass}>
        {children}
      </Link>
    )
  },

  // 이미지 - 완전히 타입 안전하게 수정
  img: ({ src, alt }) => {
    // 타입 가드로 안전한 src 처리
    if (!isValidImageSrc(src)) {
      return null
    }

    return (
      <div className="my-6">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt || ""}
          width={800}
          height={400}
          className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
          unoptimized={src.startsWith("http")}
        />
        {alt && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{alt}</p>}
      </div>
    )
  },

  // 인용문
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic">
      {children}
    </blockquote>
  ),

  // 목록
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-1 text-gray-800 dark:text-gray-200">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-800 dark:text-gray-200">{children}</ol>
  ),

  li: ({ children }) => <li className="ml-4">{children}</li>,

  // 테이블
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>,

  th: ({ children }) => (
    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
      {children}
    </td>
  ),

  // 수평선
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,

  // 강조
  strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,

  em: ({ children }) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["anchor-link"],
              },
            },
          ],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
