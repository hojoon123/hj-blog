"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import Image from "next/image"

interface ImageModalProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export default function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // ESC 키 이벤트 처리
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden" // 스크롤 방지

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = src
    link.download = alt || "image"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  const resetZoom = () => {
    setIsZoomed(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* 모바일 최적화된 컨트롤 바 */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent ${isMobile ? "p-3" : "p-6"}`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* 좌측: 모바일에서는 간소화 */}
          <div className="flex items-center gap-2 md:gap-4">
            {!isMobile && (
              <div className="bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm border border-white/20">
                <kbd className="bg-white/20 px-2 py-1 rounded text-xs font-mono">ESC</kbd>
                <span className="ml-2">키로 닫기</span>
              </div>
            )}

            {/* 줌 컨트롤 - 모바일에서 더 큰 터치 영역 */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleZoom}
                className={`${isMobile ? "p-3 text-sm" : "p-3"} bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center`}
                title={isZoomed ? "축소" : "확대"}
                type="button"
              >
                {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>

              {isZoomed && (
                <button
                  onClick={resetZoom}
                  className={`${isMobile ? "p-3 text-sm" : "p-3"} bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center`}
                  title="원본 크기"
                  type="button"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* 우측: 액션 버튼들 - 모바일 최적화 */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handleDownload}
              className={`${isMobile ? "p-3" : "p-3"} bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center`}
              title="이미지 다운로드"
              type="button"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className={`${isMobile ? "p-3" : "p-3"} bg-white/10 backdrop-blur-sm hover:bg-red-500/20 text-white rounded-lg transition-all duration-200 border border-white/20 hover:border-red-500/50 min-h-[44px] min-w-[44px] flex items-center justify-center`}
              title="닫기"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 이미지 컨테이너 - 모바일 최적화 */}
      <div
        className={`relative w-full h-full flex items-center justify-center ${isMobile ? "p-3 pt-20 pb-24" : "p-6 pt-24 pb-20"} max-w-7xl max-h-[90vh]`}
      >
        {/* 로딩 스피너 */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* 확대된 이미지 - 모바일에서 터치 제스처 지원 */}
        <div
          className={`transition-transform duration-300 ${isZoomed ? (isMobile ? "scale-125" : "scale-150") : "scale-100"} cursor-pointer overflow-auto max-w-full max-h-full`}
          style={{
            touchAction: isZoomed ? "pan-x pan-y" : "none",
          }}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={1200}
            height={800}
            className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onClick={toggleZoom}
            unoptimized={src.startsWith("http")}
            priority
          />
        </div>
      </div>

      {/* 하단 정보 바 - 모바일 최적화 */}
      {alt && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent ${isMobile ? "p-3" : "p-6"}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm text-white p-3 md:p-4 rounded-lg border border-white/20">
              <p className={`text-center leading-relaxed ${isMobile ? "text-sm" : "text-sm"}`}>{alt}</p>
              {isZoomed && (
                <p className={`text-center text-white/70 mt-2 ${isMobile ? "text-xs" : "text-xs"}`}>
                  {isMobile ? "이미지를 터치하여 축소" : "이미지를 클릭하여 축소할 수 있습니다"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 모바일 전용 제스처 안내 */}
      {isMobile && !isZoomed && imageLoaded && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm opacity-75">
          터치하여 확대
        </div>
      )}
    </div>
  )
}
