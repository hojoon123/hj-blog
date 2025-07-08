"use client"

import React from "react"

import type { ReactNode } from "react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import remarkEmoji from "remark-emoji"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { useTheme } from "@/contexts/theme-context"
import { Copy, Check, ZoomIn } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ImageModal from "./image-modal"
import type { Components } from "react-markdown"

interface MarkdownRendererProps {
  content: string
  className?: string
}

interface CodeBlockProps {
  inline?: boolean
  className?: string
  children?: ReactNode
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

// 코드 블록 컴포넌트
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

// 클릭 가능한 이미지 컴포넌트 - Hydration 에러 해결
function ClickableImage({ src, alt }: { src: string; alt: string }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {/* 이미지 컨테이너 - span으로 변경하여 p 태그와 호환 */}
      <span className="block my-6 group cursor-pointer" onClick={() => setModalOpen(true)}>
        {/* 크기 제한된 이미지 - 최대 높이 400px */}
        <span className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 block">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt || ""}
            width={800}
            height={400}
            className="w-full h-auto max-h-[400px] object-contain transition-transform group-hover:scale-105"
            unoptimized={src.startsWith("http")}
          />

          {/* 확대 아이콘 오버레이 */}
          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white p-3 rounded-full">
              <ZoomIn className="w-6 h-6" />
            </span>
          </span>

          {/* 클릭 안내 */}
          <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs px-2 py-1 rounded">
            클릭하여 확대
          </span>
        </span>

        {/* 이미지 캡션 */}
        {alt && (
          <span className="block text-center text-sm text-gray-500 dark:text-gray-400 mt-3 italic leading-relaxed">
            {alt}
          </span>
        )}
      </span>

      {/* 이미지 모달 */}
      <ImageModal src={src || "/placeholder.svg"} alt={alt} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

// 커스텀 컴포넌트들
const components: Components = {
  // 코드 블록
  code: CodeBlock,

  // 헤딩 - data 속성으로 원본 텍스트 저장
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" data-heading-text={String(children)}>
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white" data-heading-text={String(children)}>
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white" data-heading-text={String(children)}>
      {children}
    </h3>
  ),

  h4: ({ children }) => (
    <h4 className="text-lg font-bold mt-3 mb-2 text-gray-900 dark:text-white" data-heading-text={String(children)}>
      {children}
    </h4>
  ),

  h5: ({ children }) => (
    <h5 className="text-base font-bold mt-2 mb-1 text-gray-900 dark:text-white" data-heading-text={String(children)}>
      {children}
    </h5>
  ),

  h6: ({ children }) => (
    <h6 className="text-sm font-bold mt-2 mb-1 text-gray-900 dark:text-white" data-heading-text={String(children)}>
      {children}
    </h6>
  ),

  // 단락 - 이미지가 포함된 경우 특별 처리
  p: ({ children }) => {
    // children이 이미지만 포함하는지 확인
    const hasOnlyImage = React.Children.toArray(children).every((child) => {
      return React.isValidElement(child) && (child.type === "img" || (typeof child.type === "object" && child.type))
    })

    // 이미지만 있는 경우 div로 렌더링
    if (hasOnlyImage) {
      return <div className="my-6">{children}</div>
    }

    // 일반 단락
    return <p className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">{children}</p>
  },

  // 링크
  a: ({ href, children }) => {
    const isExternal = typeof href === "string" && href.startsWith("http")
    const linkClass =
      "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {children}
        </a>
      )
    }

    return (
      <Link href={href || "#"} className={linkClass}>
        {children}
      </Link>
    )
  },

  // 개선된 이미지 - Hydration 에러 해결
  img: ({ src, alt }) => {
    if (!isValidImageSrc(src)) {
      return null
    }

    return <ClickableImage src={src} alt={alt || ""} />
  },

  // 인용문 - 라이트모드는 blue 유지, 다크모드만 더 밝은 회색으로
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 dark:bg-slate-600 text-gray-700 dark:text-gray-200 italic">
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
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
