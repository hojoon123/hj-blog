# 🚀 배포 가이드 - 가비아 도메인 + Vercel

## 📋 현재 상황
- ✅ 도메인 구매: `hojun-information-science.co.kr` (가비아)
- 🔄 Vercel 배포: 진행 중
- ❌ DNS 연결: 아직 안 함

## 🔧 1단계: Vercel 배포 완료 확인

### 배포 상태 확인
\`\`\`bash
# Vercel CLI 설치 (선택사항)
npm i -g vercel

# 배포 상태 확인
vercel --version
\`\`\`

### 환경변수 설정 (Vercel Dashboard)
1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. 다음 환경변수들을 **모두** 추가:

\`\`\`bash
# 🔑 필수 - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://wbzpzlpeguhcclmevvxz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 🔑 필수 - 관리자
NEXT_PUBLIC_ADMIN_EMAILS=rhzn5512@naver.com

# 🌐 필수 - 사이트 URL
NEXT_PUBLIC_SITE_URL=https://hojun-information-science.co.kr

# 📷 필수 - 이미지 업로드
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_C1XoUq2p8Siq3AkA...

# 🔍 선택사항 - SEO (나중에 설정)
GOOGLE_SITE_VERIFICATION=your-verification-code
NAVER_SITE_VERIFICATION=your-verification-code
\`\`\`

## 🌐 2단계: 가비아 DNS 설정

### 가비아 DNS 관리 접속
1. **가비아** → **My가비아** → **도메인 관리**
2. `hojun-information-science.co.kr` → **DNS 관리** 클릭

### DNS 레코드 설정
\`\`\`bash
# 기존 A 레코드 삭제 후 CNAME 추가
Type: CNAME
Host: @
Value: cname.vercel-dns.com
TTL: 3600 (기본값)

# www 서브도메인도 추가 (선택사항)
Type: CNAME  
Host: www
Value: cname.vercel-dns.com
TTL: 3600
\`\`\`

### ⚠️ 주의사항
- **A 레코드와 CNAME은 동시에 설정 불가**
- 기존 A 레코드가 있다면 **삭제** 후 CNAME 추가
- DNS 전파는 **최대 24시간** 소요

## 🔗 3단계: Vercel 도메인 연결

### Vercel Dashboard에서 도메인 추가
1. **Vercel Dashboard** → **Settings** → **Domains**
2. **Add Domain** 클릭
3. `hojun-information-science.co.kr` 입력
4. **Add** 클릭

### 도메인 인증 대기
\`\`\`bash
# 상태 확인 (Vercel Dashboard에서)
✅ Valid Configuration
❌ Invalid Configuration (DNS 전파 대기 중)
🔄 Pending (설정 진행 중)
\`\`\`

## 🧪 4단계: 테스트 및 확인

### DNS 전파 확인
\`\`\`bash
# 터미널에서 확인
nslookup hojun-information-science.co.kr

# 온라인 도구 사용
# https://www.whatsmydns.net/
\`\`\`

### 사이트 접속 테스트
\`\`\`bash
# 1. Vercel 기본 URL (즉시 가능)
https://your-project-name.vercel.app

# 2. 커스텀 도메인 (DNS 전파 후)
https://hojun-information-science.co.kr
\`\`\`

### SEO 확인
\`\`\`bash
# 배포 후 SEO 상태 확인
https://hojun-information-science.co.kr/debug/seo
\`\`\`

## 🔍 5단계: 검색엔진 등록 (도메인 연결 후)

### Google Search Console
1. [Google Search Console](https://search.google.com/search-console/) 접속
2. **속성 추가** → **URL 접두어** 선택
3. `https://hojun-information-science.co.kr` 입력
4. **HTML 태그** 방식으로 인증
5. 인증 코드를 `GOOGLE_SITE_VERIFICATION`에 추가

### 네이버 웹마스터 도구
1. [네이버 웹마스터 도구](https://searchadvisor.naver.com/) 접속
2. **사이트 등록** → URL 입력
3. **HTML 태그** 방식으로 인증
4. 인증 코드를 `NAVER_SITE_VERIFICATION`에 추가

## ⏰ 예상 소요 시간

| 단계 | 소요 시간 | 상태 |
|------|-----------|------|
| Vercel 배포 | 5-10분 | ✅ 진행 중 |
| 환경변수 설정 | 5분 | ⏳ 대기 |
| DNS 설정 | 5분 | ⏳ 대기 |
| DNS 전파 | 1-24시간 | ⏳ 대기 |
| 도메인 연결 | 5분 | ⏳ 대기 |
| 검색엔진 등록 | 10분 | ⏳ 대기 |

## 🚨 문제 해결

### DNS 전파가 안 될 때
\`\`\`bash
# 1. DNS 설정 재확인
# 2. TTL 값을 300(5분)으로 단축
# 3. 24시간 대기
# 4. 가비아 고객센터 문의
\`\`\`

### Vercel 도메인 연결 실패
\`\`\`bash
# 1. DNS 레코드 재확인
# 2. CNAME 값 정확성 확인: cname.vercel-dns.com
# 3. Vercel에서 도메인 재추가
\`\`\`

### 환경변수 적용 안 됨
\`\`\`bash
# 1. Vercel Dashboard에서 환경변수 재확인
# 2. 프로젝트 재배포 (Deployments → Redeploy)
# 3. 브라우저 캐시 삭제
\`\`\`

## 📞 지원

### 가비아 고객센터
- **전화**: 1588-3233
- **시간**: 평일 09:00-18:00

### Vercel 지원
- **문서**: https://vercel.com/docs
- **커뮤니티**: https://github.com/vercel/vercel/discussions

---

## ✅ 체크리스트

- [ ] Vercel 배포 완료
- [ ] 환경변수 모두 설정
- [ ] 가비아 DNS CNAME 설정
- [ ] Vercel 도메인 추가
- [ ] DNS 전파 확인 (1-24시간)
- [ ] 사이트 접속 테스트
- [ ] Google Search Console 등록
- [ ] 네이버 웹마스터 도구 등록
- [ ] SEO 상태 확인

**🎉 모든 단계 완료 시 프로덕션 준비 완료!**
