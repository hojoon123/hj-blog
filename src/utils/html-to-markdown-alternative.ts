import TurndownService from "turndown"

// 타입 선언 없이 직접 require 사용 (대안)
const gfmPlugin = require("turndown-plugin-gfm").gfm

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

// GFM 플러그인 사용 - require 방식
turndownService.use(gfmPlugin)

// 나머지 코드는 동일...
export function htmlToMarkdown(html: string): string {
  try {
    if (!html || typeof html !== "string") return ""

    const cleanHtml = html
      .replace(/data-block-id="[^"]*"/g, "")
      .replace(/contenteditable="[^"]*"/g, "")
      .replace(/spellcheck="[^"]*"/g, "")
      .replace(/\s+/g, " ")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim()

    if (!cleanHtml) return ""

    const markdown = turndownService.turndown(cleanHtml)

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

// 클립보드 처리 함수
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

export function testTurndownConversion(): void {
  console.log("=== Turndown 테스트 (대안 방식) ===")
  const testHtml = `<h1>테스트</h1><p><strong>굵은 글씨</strong></p>`
  console.log("변환 결과:", htmlToMarkdown(testHtml))
}
