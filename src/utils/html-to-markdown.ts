import TurndownService from "turndown"
import { gfm } from "turndown-plugin-gfm"

// 타입 가드 함수들
function isHTMLElement(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE
}

function hasAttribute(node: Node, attr: string): boolean {
  return isHTMLElement(node) && node.hasAttribute(attr)
}

function getAttribute(node: Node, attr: string): string | null {
  return isHTMLElement(node) ? node.getAttribute(attr) : null
}

function querySelector(node: Node, selector: string): Element | null {
  return isHTMLElement(node) ? node.querySelector(selector) : null
}

// Turndown 서비스 설정
const turndownService = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  fence: "```",
  emDelimiter: "*",
  strongDelimiter: "**",
  linkStyle: "inlined",
  linkReferenceStyle: "full",
  preformattedCode: false,
})

// GitHub Flavored Markdown 플러그인 추가
turndownService.use(gfm)

// 커스텀 규칙들 추가
turndownService.addRule("strikethrough", {
  filter: ["del", "s"] as Array<keyof HTMLElementTagNameMap>,
  replacement: (content) => `~~${content}~~`,
})

// 체크박스 리스트 지원
turndownService.addRule("taskList", {
  filter: (node): boolean => {
    if (!isHTMLElement(node) || node.nodeName !== "LI") return false
    const checkbox = querySelector(node, 'input[type="checkbox"]')
    return checkbox !== null
  },
  replacement: (content, node) => {
    if (!isHTMLElement(node)) return content

    const checkbox = querySelector(node, 'input[type="checkbox"]') as HTMLInputElement | null
    const isChecked = checkbox?.checked || false
    const text = content.replace(/^\s*\[[ x]\]\s*/, "")

    return `- [${isChecked ? "x" : " "}] ${text}`
  },
})

// 코드 블록 개선
turndownService.addRule("codeBlock", {
  filter: (node): boolean => {
    if (!isHTMLElement(node) || node.nodeName !== "PRE") return false
    const firstChild = node.firstChild
    return firstChild !== null && isHTMLElement(firstChild) && firstChild.nodeName === "CODE"
  },
  replacement: (content, node) => {
    if (!isHTMLElement(node)) return content

    const codeElement = node.firstChild as HTMLElement | null
    if (!codeElement) return content

    const className = getAttribute(codeElement, "class") || ""
    const language = className.match(/language-(\w+)/)?.[1] || ""
    const code = codeElement.textContent || ""

    return `\`\`\`${language}\n${code}\n\`\`\``
  },
})

// 인용문 처리
turndownService.addRule("blockquote", {
  filter: "blockquote",
  replacement: (content) => {
    return content
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n")
  },
})

// 이미지 처리 개선
turndownService.addRule("image", {
  filter: "img",
  replacement: (content, node) => {
    if (!isHTMLElement(node)) return content

    const alt = getAttribute(node, "alt") || "이미지"
    const src = getAttribute(node, "src") || ""
    const title = getAttribute(node, "title")

    if (title) {
      return `![${alt}](${src} "${title}")`
    }
    return `![${alt}](${src})`
  },
})

// HTML을 마크다운으로 변환하는 메인 함수
export function htmlToMarkdown(html: string): string {
  try {
    if (!html || typeof html !== "string") return ""

    // HTML 전처리
    const cleanHtml = html
      .replace(/data-block-id="[^"]*"/g, "")
      .replace(/contenteditable="[^"]*"/g, "")
      .replace(/spellcheck="[^"]*"/g, "")
      .replace(/\s+/g, " ")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim()

    if (!cleanHtml) return ""

    // Turndown으로 변환
    const markdown = turndownService.turndown(cleanHtml)

    // 후처리: 마크다운 정리
    return markdown
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .replace(/^\s+|\s+$/g, "")
      .replace(/\\\*/g, "*")
      .replace(/\\\[/g, "[")
      .replace(/\\\]/g, "]")
      .trim()
  } catch (error) {
    console.error("HTML to Markdown conversion error:", error)
    return html
  }
}

// 클립보드에서 HTML 감지 및 변환
export async function handlePasteEvent(e: ClipboardEvent): Promise<string | null> {
  try {
    const clipboardData = e.clipboardData
    if (!clipboardData) return null

    const htmlData = clipboardData.getData("text/html")

    if (htmlData && htmlData.trim().length > 0) {
      const hasFormatting =
        htmlData.includes("<h1") ||
        htmlData.includes("<h2") ||
        htmlData.includes("<h3") ||
        htmlData.includes("<strong") ||
        htmlData.includes("<em") ||
        htmlData.includes("<ul") ||
        htmlData.includes("<ol") ||
        htmlData.includes("<blockquote") ||
        htmlData.includes("<code") ||
        htmlData.includes("<pre")

      if (hasFormatting) {
        const converted = htmlToMarkdown(htmlData)
        if (converted && converted.length > 0 && converted !== htmlData) {
          return converted
        }
      }
    }

    return null
  } catch (error) {
    console.error("Paste handling error:", error)
    return null
  }
}

// 테스트 함수
export function testTurndownConversion(): void {
  const testCases = [
    {
      name: "기본 서식",
      html: `<h1>제목 1</h1><p><strong>굵은 글씨</strong>와 <em>기울임</em></p>`,
    },
    {
      name: "리스트",
      html: `<ul><li>항목 1</li><li>항목 2</li></ul>`,
    },
    {
      name: "체크박스",
      html: `<ul><li><input type="checkbox" checked> 완료된 작업</li><li><input type="checkbox"> 미완료 작업</li></ul>`,
    },
    {
      name: "코드 블록",
      html: `<pre><code class="language-javascript">console.log("Hello World!");</code></pre>`,
    },
    {
      name: "인용문",
      html: `<blockquote><p>이것은 인용문입니다.</p></blockquote>`,
    },
  ]

  testCases.forEach((testCase, index) => {
    const result = htmlToMarkdown(testCase.html)
  })
}
