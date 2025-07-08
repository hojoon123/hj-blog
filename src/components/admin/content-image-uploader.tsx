"use client"

import type React from "react"
import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Loader2, ImageIcon, X } from "lucide-react"

interface ContentImageUploaderProps {
  onImageInsert: (markdownText: string, file?: File) => void
  postTitle?: string
  className?: string
}

interface UploadState {
  uploading: boolean
  dragOver: boolean
  pendingImages: Array<{
    id: string
    file: File
    preview: string
    markdownText: string
  }>
}

// ref를 통해 노출할 메서드들의 타입 정의
export interface ContentImageUploaderRef {
  uploadPendingImages: (postTitle?: string) => Promise<{ [key: string]: string }>
}

const ContentImageUploader = forwardRef<ContentImageUploaderRef, ContentImageUploaderProps>(
  ({ onImageInsert, postTitle, className = "" }, ref) => {
    const [state, setState] = useState<UploadState>({
      uploading: false,
      dragOver: false,
      pendingImages: [],
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (file: File) => {
      if (!file) return

      // 파일 타입 검증
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        alert("지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 지원)")
        return
      }

      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.")
        return
      }

      // 미리보기 생성 (업로드는 하지 않음)
      const reader = new FileReader()
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string
        const imageId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const altText = file.name.replace(/\.[^/.]+$/, "") // 확장자 제거
        const markdownText = `![${altText}](${imageId})`

        // 대기 중인 이미지 목록에 추가
        setState((prev) => ({
          ...prev,
          pendingImages: [
            ...prev.pendingImages,
            {
              id: imageId,
              file,
              preview: previewUrl,
              markdownText,
            },
          ],
        }))

        // 부모 컴포넌트에 임시 마크다운 텍스트 전달
        onImageInsert(markdownText, file)

        alert(`✅ 이미지가 대기열에 추가되었습니다!\n포스트 발행 시 실제 업로드됩니다.`)
      }
      reader.readAsDataURL(file)
    }

    // 실제 업로드 함수 (포스트 저장 시 호출)
    const uploadPendingImages = async (postTitle?: string): Promise<{ [key: string]: string }> => {
      if (state.pendingImages.length === 0) return {}

      setState((prev) => ({ ...prev, uploading: true }))

      const uploadResults: { [key: string]: string } = {}

      try {
        for (const pendingImage of state.pendingImages) {
          const formData = new FormData()
          formData.append("file", pendingImage.file)
          formData.append("isContent", "true")

          if (postTitle && postTitle.trim()) {
            formData.append("postTitle", postTitle.trim())
          }

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          const result = await response.json()

          if (response.ok && result.success) {
            uploadResults[pendingImage.id] = result.url
          } else {
            throw new Error(`${pendingImage.file.name} 업로드 실패: ${result.error}`)
          }
        }

        // 성공 시 대기열 초기화
        setState((prev) => ({
          ...prev,
          pendingImages: [],
          uploading: false,
        }))

        return uploadResults
      } catch (error) {
        setState((prev) => ({ ...prev, uploading: false }))
        throw error
      }
    }

    // ref를 통해 메서드 노출
    useImperativeHandle(ref, () => ({
      uploadPendingImages,
    }))

    const removePendingImage = (imageId: string) => {
      setState((prev) => ({
        ...prev,
        pendingImages: prev.pendingImages.filter((img) => img.id !== imageId),
      }))
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setState((prev) => ({ ...prev, dragOver: false }))

      const files = Array.from(e.dataTransfer.files)
      const imageFile = files.find((file) => file.type.startsWith("image/"))

      if (imageFile) {
        handleFileSelect(imageFile)
      }
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      setState((prev) => ({ ...prev, dragOver: true }))
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      setState((prev) => ({ ...prev, dragOver: false }))
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    }

    const handleClick = () => {
      fileInputRef.current?.click()
    }

    // 제목에서 slug 생성 (미리보기용)
    const getSlugPreview = () => {
      if (!postTitle || !postTitle.trim()) return "temp/날짜"

      return postTitle
        .trim()
        .toLowerCase()
        .replace(/[^\w가-힣\s]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 30)
    }

    return (
      <div className={`space-y-4 ${className}`}>
        {/* 대기 중인 이미지들 미리보기 */}
        {state.pendingImages.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              대기 중인 이미지 ({state.pendingImages.length}개)
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {state.pendingImages.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center gap-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                >
                  <img src={image.preview || "/placeholder.svg"} alt="" className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{image.file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(image.file.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                  <button
                    onClick={() => removePendingImage(image.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 업로드 영역 */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`
            relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
            ${
              state.dragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
            ${state.uploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              {state.uploading ? (
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4 text-gray-400" />
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {state.uploading ? "업로드 중..." : "본문 이미지 추가"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">클릭하거나 드래그하여 이미지 선택</p>

              {/* 폴더 경로 미리보기 */}
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                <p className="text-gray-600 dark:text-gray-400">
                  📁 저장 경로:{" "}
                  <span className="font-mono text-blue-600 dark:text-blue-400">posts/{getSlugPreview()}/</span>
                </p>
                {!postTitle?.trim() && (
                  <p className="text-yellow-600 dark:text-yellow-400 mt-1">⚠️ 제목을 입력하면 전용 폴더에 저장됩니다</p>
                )}
                <p className="text-green-600 dark:text-green-400 mt-1">💡 포스트 발행 시 실제 업로드됩니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

ContentImageUploader.displayName = "ContentImageUploader"

export default ContentImageUploader
