# 🎓 호준의 정보과학 - HJ Blog

> 정보과학 교육 전문가의 실무 경험과 강의 노하우를 바탕으로 한 개발 지식 공유 플랫폼

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)](https://vercel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📖 프로젝트 소개

**HJ Blog**는 정보과학 교육 전문가인 호준님의 개발 지식과 교육 노하우를 공유하는 현대적인 블로그 플랫폼입니다. Python, JavaScript, 정보과학 교육에 특화된 콘텐츠를 제공하며, 학생과 개발자 모두에게 유용한 정보를 전달합니다.

### 🎯 주요 특징

- **🎨 현대적인 디자인**: Velog 스타일의 깔끔하고 읽기 좋은 UI/UX
- **🌙 다크모드**: 완벽한 다크모드 지원으로 편안한 읽기 환경
- **📱 반응형**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화
- **⚡ 고성능**: Next.js 15 + TypeScript로 빠르고 안정적인 성능
- **🔍 스마트 검색**: 실시간 검색 및 최근 검색어 기능
- **📝 강력한 에디터**: Turndown 엔진 기반 마크다운 에디터
- **🖼️ 이미지 관리**: Vercel Blob 기반 이미지 업로드 및 관리
- **🔐 관리자 시스템**: 포스트 작성, 편집, 삭제 등 완전한 CMS 기능
- **📊 SEO 최적화**: 사이트맵, 메타태그, 구조화된 데이터 완벽 지원

## 🛠️ 기술 스택

### Frontend
- **Next.js 15** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 퍼스트 CSS 프레임워크
- **React Markdown** - 마크다운 렌더링
- **Syntax Highlighter** - 코드 하이라이팅

### Backend & Database
- **Supabase** - PostgreSQL 데이터베이스 + 인증
- **Vercel Blob** - 이미지 저장소
- **Server Actions** - 서버사이드 로직

### 개발 도구
- **Turndown** - HTML → 마크다운 변환 엔진
- **Date-fns** - 날짜 처리
- **Lucide React** - 아이콘 라이브러리

## 🚀 빠른 시작

### 1. 저장소 클론

\`\`\`bash
git clone https://github.com/your-username/hj-blog.git
cd hj-blog
\`\`\`

### 2. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 3. 환경변수 설정

`.env.local` 파일을 생성하고 아래 환경변수들을 설정하세요:

\`\`\`bash
# Supabase 설정 (필수)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 관리자 설정 (필수)
NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com

# 사이트 URL (프로덕션용)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Vercel Blob 설정 (이미지 업로드용)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# 검색엔진 인증 (선택사항)
GOOGLE_SITE_VERIFICATION=your_google_verification_code
NAVER_SITE_VERIFICATION=your_naver_verification_code
\`\`\`

### 4. 데이터베이스 설정

Supabase에서 SQL 스크립트를 순서대로 실행하세요:

\`\`\`bash
# 1. 테이블 생성
scripts/01-create-tables.sql

# 2. 샘플 데이터 삽입
scripts/02-seed-data.sql

# 3. RLS 정책 수정 (필요시)
scripts/03-fix-rls-policies.sql
\`\`\`

### 5. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 `http://localhost:3000`을 열어 확인하세요!

## 📋 환경변수 상세 설명

### 🔑 필수 환경변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 키 (관리자용) | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `NEXT_PUBLIC_ADMIN_EMAILS` | 관리자 이메일 (쉼표로 구분) | `admin@example.com,user@example.com` |

### 🌐 선택적 환경변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `NEXT_PUBLIC_SITE_URL` | 프로덕션 사이트 URL | 자동 감지 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 토큰 (이미지 업로드용) | - |
| `GOOGLE_SITE_VERIFICATION` | Google 사이트 인증 코드 | - |
| `NAVER_SITE_VERIFICATION` | 네이버 사이트 인증 코드 | - |

## 🔧 Supabase 설정 가이드

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 데이터베이스 비밀번호 설정
3. 프로젝트 URL과 API 키 복사

### 2. 환경변수 가져오기
\`\`\`bash
# Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

### 3. 데이터베이스 설정
- SQL Editor에서 `scripts/` 폴더의 SQL 파일들을 순서대로 실행
- RLS(Row Level Security) 정책이 자동으로 설정됩니다

## 🖼️ Vercel Blob 설정 (이미지 업로드)

### 1. Vercel Blob 스토어 생성
1. Vercel Dashboard → Storage → Create Database
2. Blob 선택 후 스토어 생성

### 2. 토큰 생성
1. Settings → Access Tokens → Create Token
2. 생성된 토큰을 환경변수에 추가:
\`\`\`bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxx
\`\`\`

## 🚀 배포 가이드

### Vercel 배포

1. **GitHub 연결**
\`\`\`bash
# GitHub에 푸시
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. **Vercel 프로젝트 생성**
- [Vercel](https://vercel.com)에서 GitHub 저장소 연결
- 환경변수 설정 (Settings → Environment Variables)
- 자동 배포 완료!

3. **도메인 연결** (선택사항)
- Settings → Domains에서 커스텀 도메인 추가
- DNS 설정 (CNAME 레코드)

### 환경변수 설정 (Vercel)
\`\`\`bash
# 필수 환경변수들을 Vercel Dashboard에서 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
BLOB_READ_WRITE_TOKEN=your_blob_token
\`\`\`

## 👨‍💼 관리자 기능

### 관리자 계정 설정
1. Supabase Dashboard → Authentication → Users에서 사용자 생성
2. 생성한 이메일을 `NEXT_PUBLIC_ADMIN_EMAILS`에 추가
3. `/admin/login`에서 로그인

### 관리자 기능
- ✅ 포스트 작성/편집/삭제
- ✅ 이미지 업로드 및 관리
- ✅ 카테고리 관리
- ✅ 발행/임시저장 관리
- ✅ 통계 대시보드
- ✅ Turndown HTML→마크다운 변환

## 🎨 커스터마이징

### 사이트 정보 수정
`src/utils/site-config.ts`에서 사이트 정보를 수정하세요:

\`\`\`typescript
const baseConfig: SiteConfig = {
  name: "당신의 블로그 이름",
  description: "블로그 설명",
  author: "작성자 이름",
  // ... 기타 설정
}
\`\`\`

### 테마 색상 변경
`src/app/globals.css`에서 CSS 변수를 수정하세요:

\`\`\`css
:root {
  --background: #ffffff;
  --foreground: #171717;
  /* ... 기타 색상 */
}
\`\`\`

## 🔍 주요 기능 상세

### 📝 마크다운 에디터
- **Turndown 엔진**: HTML을 마크다운으로 자동 변환
- **실시간 미리보기**: 작성과 동시에 결과 확인
- **이미지 드래그 앤 드롭**: 간편한 이미지 업로드
- **코드 하이라이팅**: 다양한 언어 지원

### 🔍 검색 기능
- **실시간 검색**: 타이핑과 동시에 결과 표시
- **최근 검색어**: 검색 기록 저장 및 관리
- **키보드 단축키**: `Ctrl+K`로 빠른 검색

### 📱 반응형 디자인
- **모바일 최적화**: 터치 친화적 인터페이스
- **태블릿 지원**: 중간 크기 화면 최적화
- **데스크톱**: 넓은 화면 활용

## 🐛 문제 해결

### 자주 발생하는 문제

1. **Supabase 연결 오류**
\`\`\`bash
# 환경변수 확인
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
\`\`\`

2. **이미지 업로드 실패**
\`\`\`bash
# Vercel Blob 토큰 확인
echo $BLOB_READ_WRITE_TOKEN
\`\`\`

3. **관리자 로그인 불가**
\`\`\`bash
# 관리자 이메일 확인
echo $NEXT_PUBLIC_ADMIN_EMAILS
\`\`\`

### 디버그 도구
개발 환경에서 `http://localhost:3000/debug/seo`를 방문하여 설정 상태를 확인하세요.

## 📊 SEO 최적화

### 자동 생성되는 SEO 요소
- ✅ 사이트맵 (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)
- ✅ RSS 피드 (`/rss.xml`)
- ✅ 구조화된 데이터 (JSON-LD)
- ✅ Open Graph 메타태그
- ✅ Twitter 카드

### 검색엔진 등록
1. **Google Search Console**
   - 사이트 등록 후 `GOOGLE_SITE_VERIFICATION` 설정
2. **네이버 웹마스터 도구**
   - 사이트 등록 후 `NAVER_SITE_VERIFICATION` 설정

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

**호준** - rhzn5512@naver.com

프로젝트 링크: [https://github.com/your-username/hj-blog](https://github.com/your-username/hj-blog)

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! ⭐**

Made with ❤️ by 호준

</div>
