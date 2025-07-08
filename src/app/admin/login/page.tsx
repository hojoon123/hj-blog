import type { Metadata } from "next"
import LoginForm from "@/components/login-form"

export const metadata: Metadata = {
  title: "관리자 로그인",
  description: "HJ Blog 관리자 로그인 페이지",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return <LoginForm />
}
