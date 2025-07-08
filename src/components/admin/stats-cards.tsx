"use client"

import { FileText, Eye, Users, FolderOpen } from "lucide-react"

interface StatsData {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
}

interface StatsCardsProps {
  stats: StatsData
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "총 포스트",
      value: stats.totalPosts,
      icon: FileText,
      color: "bg-blue-500",
      // 라이트모드: 연한 파란색, 다크모드: 어두운 슬레이트
      bgColor: "bg-blue-50 dark:bg-slate-800",
      textColor: "text-blue-600 dark:text-blue-300",
      titleColor: "text-gray-600 dark:text-gray-300",
    },
    {
      title: "발행된 포스트",
      value: stats.publishedPosts,
      icon: FolderOpen,
      color: "bg-green-500",
      bgColor: "bg-green-50 dark:bg-slate-800",
      textColor: "text-green-600 dark:text-green-300",
      titleColor: "text-gray-600 dark:text-gray-300",
    },
    {
      title: "임시저장",
      value: stats.draftPosts,
      icon: Users,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-slate-800",
      textColor: "text-yellow-600 dark:text-yellow-300",
      titleColor: "text-gray-600 dark:text-gray-300",
    },
    {
      title: "총 조회수",
      value: stats.totalViews,
      icon: Eye,
      color: "bg-purple-500",
      bgColor: "bg-purple-50 dark:bg-slate-800",
      textColor: "text-purple-600 dark:text-purple-300",
      titleColor: "text-gray-600 dark:text-gray-300",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${card.titleColor} mb-1`}>{card.title}</p>
              <p className={`text-2xl font-bold ${card.textColor}`}>{card.value.toLocaleString()}</p>
            </div>
            <div className={`${card.color} p-3 rounded-lg shadow-sm`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
