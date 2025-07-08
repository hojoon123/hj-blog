"use client"

import type React from "react"
import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Upload, X, Loader2, Eye } from "lucide-react"

interface ImageUploaderProps {
  onUpload: (url: string) => void
  currentImage?: string
  className?: string
}

interface UploadState {
  uploading: boolean
  dragOver: boolean
  preview: string | null
  pendingFile: File | null
  isUploaded: boolean
}

// ref를 통해 노출할 메서드들의 타입 정의
export interface ImageUploaderRef {
  uploadPendingFile: (postTitle?: string) => Promise<string | null>
}

const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(
  ({ onUpload, currentImage, className = "" }, ref) => {
    const [state, setState] = useState<UploadState>({
      uploading: false,
      dragOver: false,
      preview: currentImage || null,
      pendingFile: null,
      isUploaded: !!currentImage, // 기존 이미지가 있으면 업로드된 상태로 설정
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (file: File) => {
      if (!file) return

      // 미리보기 생성 (업로드는 하지 않음)
      const reader = new FileReader()
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string
        setState((prev) => ({
          ...prev,
          preview: previewUrl,
          pendingFile: file,
          isUploaded: false,
        }))
        // 임시 미리보기 URL을 부모에게 전달
        onUpload(previewUrl)
      }
      reader.readAsDataURL(file)
    }

    // 실제 업로드 함수 (포스트 저장 시 호출)
    const uploadPendingFile = async (postTitle?: string): Promise<string | null> => {
      if (!state.pendingFile) {
        // 대기 중인 파일이 없으면 현재 이미지 URL 반환 (편집 모드에서 기존 이미지 유지)
        return state.preview || null
      }

      setState((prev) => ({ ...prev, uploading: true }))

      try {
        const formData = new FormData()
        formData.append("file", state.pendingFile)
        formData.append("isContent", "false") // 썸네일 이미지

        // 포스트 제목 전달
        if (postTitle && postTitle.trim()) {
          formData.append("postTitle", postTitle.trim())
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Upload response error:", errorText)
          throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()

        if (result.success) {
          setState((prev) => ({
            ...prev,
            uploading: false,
            isUploaded: true,
            pendingFile: null,
            preview: result.url,
          }))
          return result.url
        } else {
          throw new Error(result.error || "업로드 실패")
        }
      } catch (error) {
        console.error("Upload error details:", error)
        setState((prev) => ({ ...prev, uploading: false }))
        throw error
      }
    }

    // ref를 통해 메서드 노출
    useImperativeHandle(ref, () => ({
      uploadPendingFile,
    }))

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

    const handleRemoveImage = () => {
      setState((prev) => ({
        ...prev,
        preview: null,
        pendingFile: null,
        isUploaded: false,
      }))
      onUpload("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    const handleClick = () => {
      fileInputRef.current?.click()
    }

    return (
      <div className={`space-y-4 ${className}`}>
        {/* 현재 이미지 미리보기 */}
        {state.preview && (
          <div className="relative">
            <img
              src={state.preview || "/placeholder.svg"}
              alt="업로드된 이미지"
              className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
            />

            {/* 상태 표시 */}
            <div className="absolute top-2 left-2 flex gap-2">
              {state.isUploaded ? (
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  업로드됨
                </span>
              ) : (
                <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">미리보기</span>
              )}
            </div>

            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>

            {state.uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-2 text-white">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>업로드 중...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 업로드 영역 */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${
              state.dragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
            ${state.uploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              {state.uploading ? (
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {state.uploading ? "업로드 중..." : "이미지를 선택하세요"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">드래그 앤 드롭하거나 클릭하여 파일 선택</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">JPG, PNG, GIF, WebP (최대 5MB)</p>
              {!state.isUploaded && state.pendingFile && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">💡 포스트 발행 시 실제 업로드됩니다</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  },
)

ImageUploader.displayName = "ImageUploader"

export default ImageUploader
