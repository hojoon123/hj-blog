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
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/cjs/styles/prism"
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
      className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white z-10"
      title="코드 복사"
      type="button"
      aria-label="코드 복사"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

// 언어 자동 감지 함수
function detectLanguage(code: string): string {
  const codeStr = code.toLowerCase().trim()

  // Python 감지
  if (
    codeStr.includes("print(") ||
    codeStr.includes("def ") ||
    codeStr.includes("import ") ||
    codeStr.includes("from ") ||
    codeStr.includes("class ") ||
    codeStr.includes("lambda ") ||
    codeStr.includes("if __name__") ||
    codeStr.includes("async def ") ||
    codeStr.includes("await ") ||
    codeStr.includes("try:") ||
    codeStr.includes("except ") ||
    codeStr.includes("with ") ||
    codeStr.includes("for ") ||
    codeStr.includes("while ") ||
    codeStr.includes("return ") ||
    codeStr.includes("yield ") ||
    codeStr.includes("raise ") ||
    codeStr.includes("import this") ||
    codeStr.includes("isinstance(") ||
    codeStr.includes("type(") ||
    codeStr.includes("len(") ||
    codeStr.includes("str(") ||
    codeStr.includes("int(") ||
    codeStr.includes("float(") ||
    codeStr.includes("list(") ||
    codeStr.includes("dict(") ||
    codeStr.includes("set(") ||
    codeStr.includes("tuple(") ||
    codeStr.includes("range(") ||
    codeStr.includes("map(") ||
    codeStr.includes("filter(") ||
    codeStr.includes("zip(") ||
    codeStr.includes("#")
  ) {
    return "python"
  }

  // C++ 감지
  if (
    codeStr.includes("#include") ||
    codeStr.includes("std::") ||
    codeStr.includes("cout") ||
    codeStr.includes("cin")
  ) {
    return "cpp"
  }

  // JavaScript 감지
  if (
    codeStr.includes("console.log") ||
    codeStr.includes("function ") ||
    codeStr.includes("const ") ||
    codeStr.includes("let ")
  ) {
    return "javascript"
  }

  // Java 감지
  if (codeStr.includes("public class") || codeStr.includes("system.out.println")) {
    return "java"
  }

  // HTML 감지
  if (codeStr.includes("<html") || codeStr.includes("<!doctype")) {
    return "html"
  }

  // CSS 감지
  if (codeStr.includes("{") && (codeStr.includes("color:") || codeStr.includes("background:"))) {
    return "css"
  }

  return "text"
}

// 개선된 마크다운 전처리 함수 (TypeScript 오류 수정)
function preprocessMarkdown(content: string): string {
  let processed = content

  processed = processed.replace(/`([^`]*\n[^`]*)`/g, (match, code) => {
    let cleanCode = code.trim()
    
    // 스마트 주석 처리
    cleanCode = cleanCode
      .split('\n')
      .map((line: string) => {  // index, lines 매개변수 제거
        // 주석만 있는 줄은 그대로 유지
        if (line.trim().startsWith('#')) {
          return line
        }
        
        // 코드 + 인라인 주석이 있는 경우
        const commentIndex = line.indexOf('#')
        if (commentIndex > 0) {
          const beforeComment = line.substring(0, commentIndex).trim()
          const comment = line.substring(commentIndex).trim()
          
          // 코드가 너무 길면 주석을 다음 줄로
          if (beforeComment.length > 40) {
            return beforeComment + '\n    ' + comment
          }
          // 적당한 길이면 인라인 유지 (패딩 추가)
          else {
            const padding = Math.max(2, 10 - beforeComment.length)
            return beforeComment + ' '.repeat(padding) + comment
          }
        }
        
        return line
      })
      .join('\n')
    
    return `\`\`\`python\n${cleanCode}\n\`\`\``
  })

  return processed
}

// 마크다운 후처리 함수
function postprocessMarkdown(renderedContent: string): string {
  // 임시로 치환한 # 문자를 복원
  return renderedContent.replace(/___HASH___/g, '#')
}

function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
  const { theme } = useTheme()
  const match = /language-(\w+)/.exec(className || "")
  let language = match ? match[1] : ""
  const codeString = String(children || "").replace(/\n$/, "")

  // 언어 감지
  if (!language || language === "text") {
    language = detectLanguage(codeString)
  }

  if (inline) {
    return (
      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 rounded text-sm font-mono border">
        {children}
      </code>
    )
  }

  const lineCount = codeString.split('\n').length

  return (
    <div className="relative group my-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {language.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{lineCount} lines</span>
          <CopyButton text={codeString} />
        </div>
      </div>

      {/* 코드 영역 */}
      <div className="relative">
        <SyntaxHighlighter
          style={theme === "dark" ? vscDarkPlus : vs}
          language={language}
          PreTag="div"
          showLineNumbers={lineCount > 1}
          wrapLongLines={true}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            textAlign: 'right',
            color: theme === "dark" ? '#6b7280' : '#9ca3af',
            borderRight: `1px solid ${theme === "dark" ? '#374151' : '#e5e7eb'}`,
            marginRight: '1em',
            fontSize: '12px',
          }}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace",
            }
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>

      {/* 개선된 주석 스타일링 */}
      <style jsx>{`
        .markdown-content .token.comment {
          color: ${theme === 'dark' ? '#68d391' : '#38a169'} !important;
          font-style: italic;
          background: ${theme === 'dark' ? 'rgba(104, 211, 145, 0.1)' : 'rgba(56, 161, 105, 0.1)'};
          padding: 2px 4px;
          border-radius: 3px;
          border-left: 3px solid ${theme === 'dark' ? '#68d391' : '#38a169'};
        }
        
        /* 주석 라인 전체 강조 */
        .markdown-content .line-highlight-comment {
          background: ${theme === 'dark' ? 'rgba(104, 211, 145, 0.05)' : 'rgba(56, 161, 105, 0.05)'} !important;
          border-left: 2px solid ${theme === 'dark' ? '#68d391' : '#38a169'};
          padding-left: 8px;
        }
      `}</style>
    </div>
  )
}

// 타입 안전한 이미지 처리 함수
function isValidImageSrc(src: unknown): src is string {
  return typeof src === "string" && src.length > 0
}

// 클릭 가능한 이미지 컴포넌트
function ClickableImage({ src, alt }: { src: string; alt: string }) {
  const [modalOpen, setModalOpen] = useState(false)

  const getOptimizedImageSrc = (imageSrc: string) => {
    if (imageSrc.includes("blob.vercel-storage.com")) {
      return `${imageSrc}?w=800&h=400&fit=crop&auto=format,compress&q=75&fm=webp`
    }
    return imageSrc
  }

  return (
    <>
      <span className="block my-6 group cursor-pointer" onClick={() => setModalOpen(true)}>
        <span className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 block">
          <Image
            src={getOptimizedImageSrc(src) || "/placeholder.svg"}
            alt={alt || ""}
            width={800}
            height={400}
            className="w-full h-auto max-h-[400px] object-contain transition-transform group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 800px"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAAAAAAAAAAAAAAAAAAAACv/EAB4QAAEEAgMBAAAAAAAAAAAAAAECAwQRBVIhMUFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAYEQADAQEAAAAAAAAAAAAAAAABAgMAEf/aAAwDAQACEQMRAD8A0XiyDI4jHzTRtJc1wBaQeQQdCCOhBGhWMkuqFmHvVMZpWn/Z"
          />

          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white p-3 rounded-full">
              <ZoomIn className="w-6 h-6" />
            </span>
          </span>

          <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs px-2 py-1 rounded">
            클릭하여 확대
          </span>
        </span>

        {alt && (
          <span className="block text-center text-sm text-gray-500 dark:text-gray-400 mt-3 italic leading-relaxed">
            {alt}
          </span>
        )}
      </span>

      <ImageModal src={src || "/placeholder.svg"} alt={alt} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

// 커스텀 컴포넌트들
const components: Components = {
  // 코드 블록
  code: CodeBlock,

  // 헤딩 - ID 추가로 목차 연결
  h1: ({ children }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, "")
      .replace(/\s+/g, "-")
      .trim()

    return (
      <h1
        id={id}
        className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white scroll-mt-24"
        data-heading-text={text}
      >
        {children}
      </h1>
    )
  },

  h2: ({ children }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, "")
      .replace(/\s+/g, "-")
      .trim()

    return (
      <h2
        id={id}
        className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white scroll-mt-24"
        data-heading-text={text}
      >
        {children}
      </h2>
    )
  },

  h3: ({ children }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, "")
      .replace(/\s+/g, "-")
      .trim()

    return (
      <h3
        id={id}
        className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white scroll-mt-24"
        data-heading-text={text}
      >
        {children}
      </h3>
    )
  },

  h4: ({ children }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, "")
      .replace(/\s+/g, "-")
      .trim()

    return (
      <h4
        id={id}
        className="text-lg font-bold mt-3 mb-2 text-gray-900 dark:text-white scroll-mt-24"
        data-heading-text={text}
      >
        {children}
      </h4>
    )
  },

  h5: ({ children }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, "")
      .replace(/\s+/g, "-")
      .trim()

    return (
      <h5
        id={id}
        className="text-base font-bold mt-2 mb-1 text-gray-900 dark:text-white scroll-mt-24"
        data-heading-text={text}
      >
        {children}
      </h5>
    )
  },

  h6: ({ children }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, "")
      .replace(/\s+/g, "-")
      .trim()

    return (
      <h6
        id={id}
        className="text-sm font-bold mt-2 mb-1 text-gray-900 dark:text-white scroll-mt-24"
        data-heading-text={text}
      >
        {children}
      </h6>
    )
  },

  // 단락 - TypeScript 에러 해결
  p: ({ children }) => {
    // 코드 블록이나 이미지만 있는 경우 div로 래핑하지 않음
    const hasBlockElements = React.Children.toArray(children).some((child) => {
      if (React.isValidElement(child)) {
        // 타입 안전한 방식으로 props 체크
        const childProps = child.props as any
        return (
          child.type === "img" ||
          (typeof child.type === "function" && child.type.name === "CodeBlock") ||
          (childProps &&
            childProps.className &&
            typeof childProps.className === "string" &&
            childProps.className.includes("language-"))
        )
      }
      return false
    })

    if (hasBlockElements) {
      return <>{children}</>
    }

    return <p className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">{children}</p>
  },

  // 링크
  a: ({ href, children }) => {
    const isExternal = typeof href === "string" && href.startsWith("http")
    const linkClass =
      "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label={`외부 링크: ${children} (새 창에서 열림)`}
        >
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

  // 이미지
  img: ({ src, alt }) => {
    if (!isValidImageSrc(src)) {
      return null
    }

    return <ClickableImage src={src} alt={alt || ""} />
  },

  // 인용문
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 dark:bg-slate-700 text-gray-800 dark:text-gray-100 italic">
      {children}
    </blockquote>
  ),

  // 목록
  ul: ({ children }) => (
    <ul className="mb-4 space-y-2 text-gray-800 dark:text-gray-200" role="list">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-4 space-y-2 text-gray-800 dark:text-gray-200 counter-reset-item" role="list">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="flex items-start gap-3 leading-relaxed">
      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2.5" aria-hidden="true" />
      <span className="flex-1">{children}</span>
    </li>
  ),

  // 테이블 - 인라인 스타일로 강제 적용
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 -mx-4 sm:mx-0" role="region" aria-label="데이터 테이블" tabIndex={0}>
      <div className="inline-block min-w-full align-middle">
        <table
          className="min-w-full border-collapse shadow-sm rounded-lg overflow-hidden border"
          style={{
            backgroundColor: "var(--table-bg, white)",
            borderColor: "var(--table-border, #e5e7eb)",
          }}
        >
          {children}
        </table>
      </div>
    </div>
  ),

  thead: ({ children }) => (
    <thead
      style={{
        backgroundColor: "var(--table-header-bg, #f9fafb)",
      }}
    >
      {children}
    </thead>
  ),

  th: ({ children }) => (
    <th
      className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold border-b"
      scope="col"
      style={{
        backgroundColor: "var(--table-header-bg, #f9fafb)",
        color: "var(--table-header-text, #111827)",
        borderColor: "var(--table-border, #e5e7eb)",
      }}
    >
      <div className="flex items-center gap-2">{children}</div>
    </th>
  ),

  td: ({ children }) => (
    <td
      className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm border-b"
      style={{
        backgroundColor: "var(--table-bg, white)",
        color: "var(--table-text, #1f2937)",
        borderColor: "var(--table-border-light, #f3f4f6)",
      }}
    >
      <div className="break-words">{children}</div>
    </td>
  ),

  // 테이블 행
  tr: ({ children }) => <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-700">{children}</tr>,

  // 수평선
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" role="separator" />,

  // 강조
  strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,

  em: ({ children }) => <em className="italic text-blue-600 dark:text-blue-400 font-medium">{children}</em>,
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // 마크다운 전처리
  const processedContent = preprocessMarkdown(content)
  
  return (
    <div
      className={`prose prose-lg max-w-none dark:prose-invert markdown-content ${className}`}
      style={
        {
          "--table-bg": "white",
          "--table-header-bg": "#f9fafb",
          "--table-header-text": "#111827",
          "--table-text": "#1f2937",
          "--table-border": "#e5e7eb",
          "--table-border-light": "#f3f4f6",
        } as React.CSSProperties & Record<string, string>
      }
    >
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji]}
        rehypePlugins={[rehypeRaw]}
      >
        {processedContent}
      </ReactMarkdown>

      <style jsx>{`
        .dark .markdown-content {
          --table-bg: rgb(30 41 59);
          --table-header-bg: rgb(51 65 85);
          --table-header-text: rgb(248 250 252);
          --table-text: rgb(226 232 240);
          --table-border: rgb(71 85 105);
          --table-border-light: rgb(71 85 105);
        }
        
        /* 인라인 코드 내의 # 문자 보호 */
        .markdown-content code {
          white-space: pre-wrap;
        }
        
        /* 코드 블록 내에서 헤더 스타일 무효화 */
        .markdown-content pre code h1,
        .markdown-content pre code h2,
        .markdown-content pre code h3,
        .markdown-content pre code h4,
        .markdown-content pre code h5,
        .markdown-content pre code h6 {
          font-size: inherit !important;
          font-weight: inherit !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
        }
      `}</style>
    </div>
  )
}
