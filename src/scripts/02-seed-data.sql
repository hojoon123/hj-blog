-- 카테고리 샘플 데이터
INSERT INTO categories (name, slug, description) VALUES
('JavaScript', 'javascript', 'JavaScript 관련 포스트'),
('React', 'react', 'React 개발 관련 포스트'),
('Next.js', 'nextjs', 'Next.js 프레임워크 관련 포스트'),
('CSS', 'css', 'CSS 스타일링 관련 포스트'),
('개발일기', 'dev-diary', '개발 경험과 일상 이야기');

-- 포스트 샘플 데이터
INSERT INTO posts (title, slug, content, excerpt, thumbnail_url, category_id, published) VALUES
(
  'Next.js 15의 새로운 기능들',
  'nextjs-15-new-features',
  E'# Next.js 15의 새로운 기능들\n\nNext.js 15가 출시되면서 많은 새로운 기능들이 추가되었습니다.\n\n## 주요 변경사항\n\n### 1. React 19 지원\nReact 19의 새로운 기능들을 완전히 지원합니다.\n\n### 2. 성능 개선\n빌드 시간이 대폭 단축되었습니다.\n\n### 3. 새로운 캐싱 전략\n더욱 효율적인 캐싱 시스템이 도입되었습니다.',
  'Next.js 15의 주요 새 기능들과 변경사항을 알아보세요.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM categories WHERE slug = 'nextjs'),
  true
),
(
  'React Hooks 완벽 가이드',
  'react-hooks-complete-guide',
  E'# React Hooks 완벽 가이드\n\nReact Hooks는 함수형 컴포넌트에서 상태와 생명주기를 관리할 수 있게 해주는 강력한 기능입니다.\n\n## useState Hook\n\n가장 기본적인 Hook인 useState부터 알아보겠습니다.\n\n```javascript\nconst [count, setCount] = useState(0);\n```\n\n## useEffect Hook\n\n부수 효과를 처리하는 useEffect Hook입니다.\n\n```javascript\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);\n```',
  'React Hooks의 모든 것을 상세히 설명합니다.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM categories WHERE slug = 'react'),
  true
),
(
  'CSS Grid vs Flexbox 언제 무엇을 사용할까?',
  'css-grid-vs-flexbox',
  E'# CSS Grid vs Flexbox\n\nCSS 레이아웃을 구성할 때 Grid와 Flexbox 중 어떤 것을 선택해야 할까요?\n\n## Flexbox는 언제?\n\n- 1차원 레이아웃 (행 또는 열)\n- 컴포넌트 내부 정렬\n- 네비게이션 바\n- 카드 내부 요소 정렬\n\n## Grid는 언제?\n\n- 2차원 레이아웃 (행과 열)\n- 전체 페이지 레이아웃\n- 복잡한 레이아웃 구조',
  'CSS Grid와 Flexbox의 차이점과 사용 시기를 알아보세요.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM categories WHERE slug = 'css'),
  true
),
(
  '개발자로서의 첫 번째 해',
  'my-first-year-as-developer',
  E'# 개발자로서의 첫 번째 해\n\n코딩 강사가 되기까지의 여정을 공유합니다.\n\n## 시작\n\n처음 개발을 시작했을 때의 막막함과 설렘을 기억합니다.\n\n## 성장\n\n매일 새로운 것을 배우며 성장하는 과정이 즐거웠습니다.\n\n## 깨달음\n\n혼자 공부하는 것보다 함께 나누며 배우는 것이 더 의미있다는 것을 알게 되었습니다.',
  '개발자가 되기까지의 여정과 경험을 공유합니다.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM categories WHERE slug = 'dev-diary'),
  true
),
(
  'JavaScript ES2024 새로운 기능들',
  'javascript-es2024-features',
  E'# JavaScript ES2024 새로운 기능들\n\nES2024에서 추가된 새로운 JavaScript 기능들을 살펴보겠습니다.\n\n## Array.prototype.toSorted()\n\n기존 배열을 변경하지 않고 정렬된 새 배열을 반환합니다.\n\n```javascript\nconst numbers = [3, 1, 4, 1, 5];\nconst sorted = numbers.toSorted();\nconsole.log(numbers); // [3, 1, 4, 1, 5] (원본 유지)\nconsole.log(sorted);  // [1, 1, 3, 4, 5]\n```\n\n## Object.groupBy()\n\n배열의 요소들을 그룹화하는 새로운 메서드입니다.',
  'ES2024에서 추가된 새로운 JavaScript 기능들을 알아보세요.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM categories WHERE slug = 'javascript'),
  true
);
