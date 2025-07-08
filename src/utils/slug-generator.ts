// 간단하고 안정적인 한글-영문 변환 매핑
const koreanToEnglish: Record<string, string> = {
  // 자주 사용되는 한글 단어들을 직접 매핑
  개발: "development",
  프로그래밍: "programming",
  코딩: "coding",
  자바스크립트: "javascript",
  리액트: "react",
  넥스트: "nextjs",
  타입스크립트: "typescript",
  웹: "web",
  앱: "app",
  데이터: "data",
  베이스: "base",
  서버: "server",
  클라이언트: "client",
  프론트엔드: "frontend",
  백엔드: "backend",
  풀스택: "fullstack",
  디자인: "design",
  사용자: "user",
  경험: "experience",
  인터페이스: "interface",
  성능: "performance",
  최적화: "optimization",
  보안: "security",
  테스트: "test",
  배포: "deploy",
  운영: "operation",
  관리: "management",
  시스템: "system",
  플랫폼: "platform",
  서비스: "service",
  솔루션: "solution",
  기술: "technology",
  도구: "tool",
  라이브러리: "library",
  프레임워크: "framework",
  컴포넌트: "component",
  모듈: "module",
  패키지: "package",
  버전: "version",
  업데이트: "update",
  설치: "install",
  설정: "config",
  환경: "environment",
  변수: "variable",
  함수: "function",
  클래스: "class",
  객체: "object",
  배열: "array",
  문자열: "string",
  숫자: "number",
  불린: "boolean",
  널: "null",
  언디파인드: "undefined",
  에러: "error",
  예외: "exception",
  디버그: "debug",
  로그: "log",
  콘솔: "console",
  브라우저: "browser",
  모바일: "mobile",
  반응형: "responsive",
  적응형: "adaptive",
  크로스: "cross",
  호환: "compatible",
  지원: "support",
  기능: "feature",
  특징: "characteristic",
  장점: "advantage",
  단점: "disadvantage",
  비교: "comparison",
  분석: "analysis",
  연구: "research",
  학습: "learning",
  교육: "education",
  강의: "lecture",
  튜토리얼: "tutorial",
  가이드: "guide",
  문서: "documentation",
  예제: "example",
  샘플: "sample",
  데모: "demo",
  프로젝트: "project",
  작업: "work",
  업무: "task",
  일정: "schedule",
  계획: "plan",
  목표: "goal",
  결과: "result",
  성과: "achievement",
  성공: "success",
  실패: "failure",
  문제: "problem",
  해결: "solution",
  방법: "method",
  방식: "way",
  과정: "process",
  절차: "procedure",
  단계: "step",
  순서: "order",
  구조: "structure",
  패턴: "pattern",
  아키텍처: "architecture",
  모델: "model",
  뷰: "view",
  컨트롤러: "controller",
  라우터: "router",
  미들웨어: "middleware",
  데이터베이스: "database",
  쿼리: "query",
  스키마: "schema",
  테이블: "table",
  컬럼: "column",
  인덱스: "index",
  관계: "relation",
  조인: "join",
  트랜잭션: "transaction",
  백업: "backup",
  복구: "recovery",
  마이그레이션: "migration",
  시드: "seed",
  // 일반적인 단어들
  무엇: "what",
  언제: "when",
  어디: "where",
  왜: "why",
  어떻게: "how",
  누구: "who",
  이란: "is",
  이다: "is",
  하다: "do",
  되다: "become",
  있다: "exist",
  없다: "not-exist",
  좋다: "good",
  나쁘다: "bad",
  크다: "big",
  작다: "small",
  많다: "many",
  적다: "few",
  빠르다: "fast",
  느리다: "slow",
  쉽다: "easy",
  어렵다: "difficult",
  새롭다: "new",
  오래되다: "old",
  중요하다: "important",
  필요하다: "necessary",
  가능하다: "possible",
  불가능하다: "impossible",
  // 숫자
  하나: "one",
  둘: "two",
  셋: "three",
  넷: "four",
  다섯: "five",
  여섯: "six",
  일곱: "seven",
  여덟: "eight",
  아홉: "nine",
  열: "ten",
  첫번째: "first",
  두번째: "second",
  세번째: "third",
  마지막: "last",
}

// 한글을 로마자로 변환하는 간단한 함수
function koreanToRoman(text: string): string {
  // 먼저 전체 단어 매핑 확인
  const lowerText = text.toLowerCase()
  if (koreanToEnglish[lowerText]) {
    return koreanToEnglish[lowerText]
  }

  // 단어별로 분리해서 변환
  const words = text.split(/\s+/)
  const convertedWords = words.map((word) => {
    const cleanWord = word.replace(/[^\w가-힣]/g, "")
    return koreanToEnglish[cleanWord] || transliterateKorean(cleanWord)
  })

  return convertedWords.join("-")
}

// 기본적인 한글 음성 변환 (간단한 버전)
function transliterateKorean(text: string): string {
  const koreanMap: Record<string, string> = {
    ㄱ: "g",
    ㄴ: "n",
    ㄷ: "d",
    ㄹ: "r",
    ㅁ: "m",
    ㅂ: "b",
    ㅅ: "s",
    ㅇ: "",
    ㅈ: "j",
    ㅊ: "ch",
    ㅋ: "k",
    ㅌ: "t",
    ㅍ: "p",
    ㅎ: "h",
    ㅏ: "a",
    ㅑ: "ya",
    ㅓ: "eo",
    ㅕ: "yeo",
    ㅗ: "o",
    ㅛ: "yo",
    ㅜ: "u",
    ㅠ: "yu",
    ㅡ: "eu",
    ㅣ: "i",
    ㅐ: "ae",
    ㅒ: "yae",
    ㅔ: "e",
    ㅖ: "ye",
    ㅘ: "wa",
    ㅙ: "wae",
    ㅚ: "oe",
    ㅝ: "wo",
    ㅞ: "we",
    ㅟ: "wi",
    ㅢ: "ui",
  }

  // 한글이 아닌 경우 그대로 반환
  if (!/[가-힣]/.test(text)) {
    return text
  }

  // 간단한 음성 변환 (완벽하지 않지만 기본적인 변환)
  let result = ""
  for (const char of text) {
    if (/[가-힣]/.test(char)) {
      // 한글 완성형 문자를 간단하게 변환
      const code = char.charCodeAt(0) - 0xac00
      if (code >= 0 && code <= 11171) {
        const cho = Math.floor(code / 588)
        const jung = Math.floor((code % 588) / 28)
        const jong = code % 28

        const choList = [
          "g",
          "kk",
          "n",
          "d",
          "tt",
          "r",
          "m",
          "b",
          "pp",
          "s",
          "ss",
          "",
          "j",
          "jj",
          "ch",
          "k",
          "t",
          "p",
          "h",
        ]
        const jungList = [
          "a",
          "ae",
          "ya",
          "yae",
          "eo",
          "e",
          "yeo",
          "ye",
          "o",
          "wa",
          "wae",
          "oe",
          "yo",
          "u",
          "wo",
          "we",
          "wi",
          "yu",
          "eu",
          "ui",
          "i",
        ]
        const jongList = [
          "",
          "g",
          "kk",
          "gs",
          "n",
          "nj",
          "nh",
          "d",
          "r",
          "rg",
          "rm",
          "rb",
          "rs",
          "rt",
          "rp",
          "rh",
          "m",
          "b",
          "bs",
          "s",
          "ss",
          "ng",
          "j",
          "ch",
          "k",
          "t",
          "p",
          "h",
        ]

        result += (choList[cho] || "") + (jungList[jung] || "") + (jongList[jong] || "")
      } else {
        result += char
      }
    } else {
      result += char
    }
  }

  return result || "untitled"
}

// 슬러그 생성 함수 (개선된 버전)
export function generateSlug(title: string): string {
  if (!title || title.trim() === "") {
    return "untitled"
  }

  return (
    title
      .trim()
      .toLowerCase()
      // 한글을 영문으로 변환
      .split(/\s+/)
      .map((word) => {
        // 특수문자 제거
        const cleanWord = word.replace(/[^\w가-힣]/g, "")
        if (!cleanWord) return ""

        // 한글이 포함된 경우 변환
        if (/[가-힣]/.test(cleanWord)) {
          return koreanToRoman(cleanWord)
        }

        // 영문/숫자는 그대로
        return cleanWord
      })
      .filter((word) => word.length > 0)
      .join("-")
      .replace(/-+/g, "-") // 연속 하이픈 제거
      .replace(/^-|-$/g, "") // 앞뒤 하이픈 제거
      .slice(0, 100) || // 길이 제한
    "untitled"
  )
}

// 슬러그 중복 확인 및 고유 슬러그 생성
export async function generateUniqueSlug(
  title: string,
  checkFunction: (slug: string) => Promise<boolean>,
): Promise<string> {
  let baseSlug = generateSlug(title)

  // 빈 슬러그인 경우 기본값 사용
  if (!baseSlug || baseSlug === "") {
    baseSlug = "untitled"
  }

  let finalSlug = baseSlug
  let counter = 1

  // 중복 확인
  while (await checkFunction(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`
    counter++
  }

  return finalSlug
}

// 테스트 함수 (개발 시 사용)
export function testSlugGeneration() {
  const testCases = [
    "개발이란 무엇일까",
    "JavaScript 완벽 가이드",
    "React Hooks 사용법",
    "Next.js 15 새로운 기능",
    "CSS Grid vs Flexbox",
    "개발자의 첫 번째 해",
    "프로그래밍 언어 비교",
    "웹 개발 트렌드 2024",
  ]

  console.log("=== Slug Generation Test ===")
  testCases.forEach((title) => {
    const slug = generateSlug(title)
    console.log(`"${title}" -> "${slug}"`)
  })
}
