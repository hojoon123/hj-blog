"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  Eye,
  FileText,
  ImageIcon,
  Tag,
  Type,
  Upload,
  Clipboard,
  TestTube,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import type { Category, PostFormData, CategoriesApiResponse } from "@/types/blog"
import ImageUploader, { type ImageUploaderRef } from "./image-uploader"
import ContentImageUploader, { type ContentImageUploaderRef } from "./content-image-uploader"
import MarkdownRenderer from "../markdown-renderer"
import { handlePasteEvent, htmlToMarkdown, testTurndownConversion } from "@/utils/html-to-markdown"
import { generateSlug } from "@/utils/slug-generator"

interface PostEditorProps {
  initialData?: PostFormData
  postId?: string
  isEdit?: boolean
}

interface PostEditorState {
  categories: Category[]
  loading: boolean
  saving: boolean
  previewMode: boolean
  formData: PostFormData
  cursorPosition: number
  pasteConversionEnabled: boolean
  sidebarCollapsed: boolean // 모바일 사이드바 상태
}

interface SubmitResponse {
  success: boolean
  post?: any
  error?: string
}

export default function PostEditor({ initialData, postId, isEdit = false }: PostEditorProps) {
  const router = useRouter()
  const imageUploaderRef = useRef<ImageUploaderRef>(null)
  const contentImageUploaderRef = useRef<ContentImageUploaderRef>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [state, setState] = useState<PostEditorState>({
    categories: [],
    loading: false,
    saving: false,
    previewMode: false,
    formData: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      thumbnail_url: initialData?.thumbnail_url || "",
      category_id: initialData?.category_id || "",
      published: initialData?.published || false,
    },
    cursorPosition: 0,
    pasteConversionEnabled: true,
    sidebarCollapsed: true, // 모바일에서는 기본적으로 접힘
  })

  // 카테고리 목록 로드
  useEffect(() => {
    fetchCategories()
  }, [])

  // 텍스트 에리어에 붙여넣기 이벤트 리스너 추가
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea || !state.pasteConversionEnabled) return

    const handlePaste = async (e: ClipboardEvent) => {
      const markdownContent = await handlePasteEvent(e)

      if (markdownContent) {
        e.preventDefault()

        const currentContent = state.formData.content
        const cursorPos = textarea.selectionStart
        const newContent = currentContent.slice(0, cursorPos) + markdownContent + currentContent.slice(cursorPos)

        setState((prev) => ({
          ...prev,
          formData: {
            ...prev.formData,
            content: newContent,
          },
        }))

        setTimeout(() => {
          const newCursorPos = cursorPos + markdownContent.length
          textarea.setSelectionRange(newCursorPos, newCursorPos)
          textarea.focus()
        }, 0)

        alert("✅ HTML이 마크다운으로 변환되어 삽입되었습니다!")
      }
    }

    textarea.addEventListener("paste", handlePaste)
    return () => textarea.removeEventListener("paste", handlePaste)
  }, [state.formData.content, state.pasteConversionEnabled])

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await fetch("/api/admin/categories")
      if (!response.ok) throw new Error("카테고리를 불러오는데 실패했습니다.")
      const data: CategoriesApiResponse = await response.json()
      setState((prev) => ({ ...prev, categories: data.categories || [] }))
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleInputChange = (field: keyof PostFormData, value: string | boolean): void => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
    }))
  }

  const handleImageUpload = (url: string): void => {
    handleInputChange("thumbnail_url", url)
  }

  const handleContentImageInsert = (markdownText: string, file?: File): void => {
    const textarea = textareaRef.current
    if (!textarea) return

    const currentContent = state.formData.content
    const cursorPos = textarea.selectionStart || currentContent.length
    const newContent =
      currentContent.slice(0, cursorPos) + "\n\n" + markdownText + "\n\n" + currentContent.slice(cursorPos)

    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, content: newContent },
    }))

    setTimeout(() => {
      const newCursorPos = cursorPos + markdownText.length + 4
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    }, 100)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange("content", e.target.value)
    setState((prev) => ({ ...prev, cursorPosition: e.target.selectionStart }))
  }

  // Turndown 테스트 변환 함수
  const testTurndownHtmlConversion = () => {
    const testHtml = `
      <h1>코딩 기초 1. 코딩 그리고 정보과학이 말하는 언어</h1>
      
      <h2>💻 코딩이란?</h2>
      <p>컴퓨터가 이해할 수 있는 언어로 명령을 작성하는 것</p>
      
      <p>생각해보자. 너희가 매일 사용하는 스마트폰, 컴퓨터, 게임들이 어떻게 만들어졌을까? 바로 <strong>코딩</strong>으로 만들어진 거다!</p>
      
      <h3>🐍 Python</h3>
      <p>초보자에게 가장 친근한 언어</p>
      
      <p>주요 활용 분야:</p>
      <ul>
        <li><strong>인공지능과 머신러닝</strong>: ChatGPT 같은 AI 개발</li>
        <li>데이터 분석: 유튜브 조회수 분석, 주식 데이터 분석</li>
        <li>웹 개발: 인스타그램이 Python으로 만들어졌다</li>
      </ul>
      
      <blockquote>
        <p>Python은 <strong>"인간이 읽기 쉬운 코드"</strong>를 만드는 게 목표라서 다른 언어에 비해 배우기 쉽다.</p>
      </blockquote>

      <h3>☕ Java</h3>
      <p>안드로이드 앱의 아버지</p>
      
      <p>체크리스트:</p>
      <ul>
        <li><input type="checkbox" checked> 안드로이드 앱 개발</li>
        <li><input type="checkbox"> 웹 백엔드 개발</li>
        <li><input type="checkbox" checked> 엔터프라이즈 시스템</li>
      </ul>

      <pre><code class="language-java">
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
      </code></pre>
    `

    const converted = htmlToMarkdown(testHtml)

    // 현재 커서 위치에 삽입
    const textarea = textareaRef.current
    if (textarea) {
      const currentContent = state.formData.content
      const cursorPos = textarea.selectionStart
      const newContent =
        currentContent.slice(0, cursorPos) + "\n\n" + converted + "\n\n" + currentContent.slice(cursorPos)

      setState((prev) => ({
        ...prev,
        formData: { ...prev.formData, content: newContent },
      }))

      setTimeout(() => {
        const newCursorPos = cursorPos + converted.length + 4
        textarea.setSelectionRange(newCursorPos, newCursorPos)
        textarea.focus()
      }, 100)
    }

    // 콘솔에서 전체 테스트 실행
    testTurndownConversion()
    alert("🎉 Turndown 테스트 마크다운이 삽입되었습니다!")
  }

  const handleSubmit = async (publishNow = false): Promise<void> => {
    if (!state.formData.title.trim() || !state.formData.content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    setState((prev) => ({ ...prev, saving: true }))

    try {
      let finalThumbnailUrl = state.formData.thumbnail_url
      let finalContent = state.formData.content

      // 1. 썸네일 이미지 업로드 (더 안전한 처리)
      if (imageUploaderRef.current?.uploadPendingFile) {
        try {
          console.log("썸네일 업로드 시작...")
          const uploadedUrl = await imageUploaderRef.current.uploadPendingFile(state.formData.title)
          if (uploadedUrl) {
            finalThumbnailUrl = uploadedUrl
            console.log("썸네일 업로드 성공:", uploadedUrl)
          } else {
            console.log("썸네일 업로드 없음 (기존 이미지 유지)")
          }
        } catch (uploadError) {
          console.error("썸네일 업로드 에러:", uploadError)
          const errorMessage = uploadError instanceof Error ? uploadError.message : "알 수 없는 업로드 오류"
          const proceed = confirm(
            `썸네일 업로드에 실패했습니다: ${errorMessage}\n\n기존 썸네일을 유지하고 계속 진행하시겠습니까?`,
          )
          if (!proceed) {
            setState((prev) => ({ ...prev, saving: false }))
            return
          }
          // 에러 발생 시 기존 썸네일 URL 유지
          console.log("썸네일 업로드 실패, 기존 URL 유지:", finalThumbnailUrl)
        }
      }

      // 2. 본문 이미지들 업로드 및 URL 교체
      if (contentImageUploaderRef.current?.uploadPendingImages) {
        try {
          console.log("본문 이미지 업로드 시작...")
          const uploadResults = await contentImageUploaderRef.current.uploadPendingImages(state.formData.title)

          if (Object.keys(uploadResults).length > 0) {
            let updatedContent = finalContent

            // 각 임시 ID를 실제 URL로 교체
            Object.entries(uploadResults).forEach(([tempId, realUrl]) => {
              if (updatedContent.includes(tempId)) {
                updatedContent = updatedContent.replaceAll(tempId, realUrl)
              }
            })

            finalContent = updatedContent
            console.log("본문 이미지 업로드 성공:", Object.keys(uploadResults).length, "개")
          }
        } catch (uploadError) {
          console.error("본문 이미지 업로드 에러:", uploadError)
          const errorMessage = uploadError instanceof Error ? uploadError.message : "알 수 없는 업로드 오류"
          const proceed = confirm(`본문 이미지 업로드에 실패했습니다: ${errorMessage}\n\n이미지 없이 진행하시겠습니까?`)
          if (!proceed) {
            setState((prev) => ({ ...prev, saving: false }))
            return
          }
        }
      }

      // 3. 서버에 포스트 저장
      console.log("포스트 저장 시작...")
      const url = isEdit && postId ? `/api/admin/posts/${postId}` : "/api/admin/posts"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...state.formData,
          content: finalContent,
          thumbnail_url: finalThumbnailUrl,
          published: publishNow,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("서버 응답 에러:", errorText)
        throw new Error(`서버 오류: ${response.status} ${response.statusText}`)
      }

      const result: SubmitResponse = await response.json()

      if (result.success) {
        const action = isEdit ? "수정" : "작성"
        const status = publishNow ? "발행" : "임시저장"
        alert(`포스트가 ${action} 및 ${status}되었습니다!`)
        router.push("/admin/posts")
      } else {
        const action = isEdit ? "수정" : "저장"
        throw new Error(result.error || "알 수 없는 오류")
      }
    } catch (error) {
      console.error("포스트 저장 전체 에러:", error)
      const action = isEdit ? "수정" : "저장"
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류"
      alert(`포스트 ${action} 중 오류가 발생했습니다: ${errorMessage}`)
    } finally {
      setState((prev) => ({ ...prev, saving: false }))
    }
  }

  const togglePreviewMode = (): void => {
    setState((prev) => ({ ...prev, previewMode: !prev.previewMode }))
  }

  const togglePasteConversion = (): void => {
    setState((prev) => ({ ...prev, pasteConversionEnabled: !prev.pasteConversionEnabled }))
  }

  const toggleSidebar = (): void => {
    setState((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }))
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 - 모바일 최적화 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 pb-4 lg:pb-6 border-b border-gray-200 dark:border-gray-700 gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isEdit ? "포스트 편집" : "새 포스트 작성"}
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
            마크다운 문법을 사용하여 포스트를 작성하세요 • Powered by Turndown
            {state.formData.title && (
              <span className="block lg:inline lg:ml-2 text-green-600 dark:text-green-400 mt-1 lg:mt-0">
                📁 posts/{generateSlug(state.formData.title)}/
              </span>
            )}
          </p>
        </div>

        {/* 버튼 그룹 - 모바일에서 스크롤 가능 */}
        <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto pb-2 lg:pb-0">
          {/* Turndown 테스트 버튼 - 모바일에서 축약 */}
          <button
            onClick={testTurndownHtmlConversion}
            className="flex items-center gap-2 px-3 lg:px-4 py-2.5 text-xs lg:text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors font-medium whitespace-nowrap"
            type="button"
            title="Turndown HTML → 마크다운 변환 테스트"
          >
            <TestTube className="w-4 h-4" />
            <span className="hidden sm:inline">Turndown 테스트</span>
            <span className="sm:hidden">테스트</span>
          </button>

          {/* HTML 변환 토글 */}
          <button
            onClick={togglePasteConversion}
            className={`flex items-center gap-2 px-3 lg:px-4 py-2.5 text-xs lg:text-sm rounded-lg transition-colors font-medium whitespace-nowrap ${
              state.pasteConversionEnabled
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
            type="button"
            title="Notion/구글독스 복사 시 자동 마크다운 변환 (Turndown 엔진)"
          >
            <Clipboard className="w-4 h-4" />
            <span className="hidden sm:inline">{state.pasteConversionEnabled ? "Turndown ON" : "변환 OFF"}</span>
            <span className="sm:hidden">{state.pasteConversionEnabled ? "ON" : "OFF"}</span>
          </button>

          {/* 미리보기 토글 */}
          <button
            onClick={togglePreviewMode}
            className="flex items-center gap-2 px-3 lg:px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium text-xs lg:text-sm whitespace-nowrap"
            type="button"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{state.previewMode ? "편집" : "미리보기"}</span>
            <span className="sm:hidden">{state.previewMode ? "편집" : "미리"}</span>
          </button>

          {/* 임시저장 */}
          <button
            onClick={() => handleSubmit(false)}
            disabled={state.saving}
            className="flex items-center gap-2 px-3 lg:px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 font-medium text-xs lg:text-sm whitespace-nowrap"
            type="button"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{state.saving ? "저장 중..." : "임시저장"}</span>
            <span className="sm:hidden">저장</span>
          </button>

          {/* 발행하기 */}
          <button
            onClick={() => handleSubmit(true)}
            disabled={state.saving}
            className="flex items-center gap-2 px-4 lg:px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-xs lg:text-sm whitespace-nowrap"
            type="button"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">{state.saving ? "발행 중..." : "발행하기"}</span>
            <span className="sm:hidden">발행</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* 메인 에디터 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 제목 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Type className="w-4 h-4" />
              제목
            </label>
            <input
              type="text"
              value={state.formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="포스트 제목을 입력하세요"
              className="w-full px-4 py-3 text-base lg:text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4" />
              내용 {state.previewMode && "(미리보기)"}
              {state.pasteConversionEnabled && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                  Turndown ON
                </span>
              )}
            </label>
            {state.previewMode ? (
              <div className="min-h-[400px] lg:min-h-[500px] p-4 lg:p-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800">
                {state.formData.content ? (
                  <MarkdownRenderer content={state.formData.content} />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">내용을 입력하면 미리보기가 표시됩니다.</p>
                )}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={state.formData.content}
                onChange={handleTextareaChange}
                placeholder={`마크다운 문법을 사용하여 내용을 작성하세요...

💡 팁: ${
                  state.pasteConversionEnabled
                    ? "Notion, 구글 독스 등에서 복사한 내용을 붙여넣으면 Turndown이 자동으로 마크다운으로 변환합니다!"
                    : "자동 변환이 비활성화되어 있습니다. 상단 'Turndown ON' 버튼을 클릭하여 활성화하세요."
                }

🧪 테스트: 상단 'Turndown 테스트' 버튼을 클릭하면 고품질 마크다운 샘플이 삽입됩니다.

📦 엔진: Turndown (GitHub에서 사용하는 HTML → Markdown 변환기)`}
                className="w-full h-[400px] lg:h-[500px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm resize-none"
              />
            )}
          </div>
        </div>

        {/* 사이드바 - 모바일에서 접을 수 있음 */}
        <div className="space-y-6">
          {/* 모바일 사이드바 토글 버튼 */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium"
            type="button"
          >
            <span>포스트 설정</span>
            {state.sidebarCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>

          {/* 사이드바 내용 */}
          <div className={`space-y-6 ${state.sidebarCollapsed ? "hidden lg:block" : "block"}`}>
            {/* 본문 이미지 업로드 */}
            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Upload className="w-4 h-4" />
                본문 이미지 추가
              </label>
              <ContentImageUploader
                ref={contentImageUploaderRef}
                onImageInsert={handleContentImageInsert}
                postTitle={state.formData.title}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 이미지가 대기열에 추가되고 포스트 발행 시 업로드됩니다
              </p>
            </div>

            {/* 카테고리 */}
            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Tag className="w-4 h-4" />
                카테고리
              </label>
              <select
                value={state.formData.category_id}
                onChange={(e) => handleInputChange("category_id", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="">카테고리 선택</option>
                {state.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 썸네일 업로드 */}
            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <ImageIcon className="w-4 h-4" />
                썸네일 이미지
              </label>
              <ImageUploader
                ref={imageUploaderRef}
                onUpload={handleImageUpload}
                currentImage={state.formData.thumbnail_url}
              />
            </div>

            {/* 요약 */}
            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <FileText className="w-4 h-4" />
                요약 (선택사항)
              </label>
              <textarea
                value={state.formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                placeholder="포스트 요약을 입력하세요 (비워두면 자동 생성)"
                className="w-full h-20 lg:h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{state.formData.excerpt.length}/200자</p>
            </div>

            {/* 기능 안내 */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="text-sm font-medium text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                <Clipboard className="w-4 h-4" />✨ 주요 기능
              </h4>
              <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
                <div>• 📁 게시글별 폴더 관리</div>
                <div>• 🗑️ 포스트 삭제 시 이미지 자동 삭제</div>
                <div>• 🖼️ 이미지 크기 제한 & 클릭 확대</div>
                <div>• 🎨 개선된 모달 UI</div>
                <div>• 🔍 줌 인/아웃 기능</div>
                <div>• ⏰ 포스트 발행 시 이미지 업로드</div>
                <div>• 🔧 Turndown HTML → 마크다운 변환</div>
              </div>
            </div>

            {/* 마크다운 도움말 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">📝 마크다운 문법</h4>
              <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <div># 제목1</div>
                <div>## 제목2</div>
                <div>### 제목3</div>
                <div>\`\`\`javascript</div>
                <div>코드 블록</div>
                <div>\`\`\`</div>
                <div>**굵은 글씨**</div>
                <div>*기울임*</div>
                <div>[링크](URL)</div>
                <div>![이미지](URL)</div>
                <div>- [ ] 체크박스</div>
                <div>- [x] 완료된 작업</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
