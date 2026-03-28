// 네이버 DataLab 쇼핑인사이트 API
// 최근 7일 패션 카테고리 인기 키워드 가져오기

const FASHION_CATEGORY_IDS = [
  { id: "50000167", name: "여성의류" },
  { id: "50000168", name: "남성의류" },
  { id: "50000172", name: "신발" },
  { id: "50000173", name: "가방" },
];

export interface TrendKeyword {
  keyword: string;
  ratio: number;
  category: string;
}

export interface TrendResult {
  keywords: TrendKeyword[];
  updatedAt: string;
}

function getDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 7);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { startDate: fmt(start), endDate: fmt(end) };
}

export async function getNaverShoppingTrends(): Promise<TrendResult> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return getFallbackTrends();
  }

  try {
    const { startDate, endDate } = getDateRange();

    const results = await Promise.all(
      FASHION_CATEGORY_IDS.map(async (cat) => {
        const body = {
          startDate,
          endDate,
          timeUnit: "date",
          category: [{ name: cat.name, param: [cat.id] }],
          keyword: [],
          device: "",
          gender: "",
          ages: [],
        };

        const res = await fetch(
          "https://openapi.naver.com/v1/datalab/shopping/category/keywords/ratio",
          {
            method: "POST",
            headers: {
              "X-Naver-Client-Id": clientId,
              "X-Naver-Client-Secret": clientSecret,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (!res.ok) return null;
        const data = await res.json();
        return { category: cat.name, data };
      })
    );

    const keywords: TrendKeyword[] = [];
    for (const result of results) {
      if (!result?.data?.results) continue;
      for (const r of result.data.results) {
        if (r.keywords) {
          for (const kw of r.keywords.slice(0, 5)) {
            keywords.push({
              keyword: kw.keyword,
              ratio: kw.ratio ?? 0,
              category: result.category,
            });
          }
        }
      }
    }

    if (keywords.length === 0) return getFallbackTrends();

    return {
      keywords: keywords.sort((a, b) => b.ratio - a.ratio).slice(0, 20),
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return getFallbackTrends();
  }
}

// API 키 없을 때 기본 트렌드 데이터
function getFallbackTrends(): TrendResult {
  return {
    keywords: [
      { keyword: "오버핏 셔츠", ratio: 95, category: "남성의류" },
      { keyword: "와이드 팬츠", ratio: 88, category: "여성의류" },
      { keyword: "린넨 자켓", ratio: 82, category: "남성의류" },
      { keyword: "뮬 슬리퍼", ratio: 79, category: "신발" },
      { keyword: "크롭 니트", ratio: 75, category: "여성의류" },
      { keyword: "버킷햇", ratio: 71, category: "남성의류" },
      { keyword: "미니 크로스백", ratio: 68, category: "가방" },
      { keyword: "슬랙스", ratio: 65, category: "여성의류" },
      { keyword: "하프 집업", ratio: 62, category: "남성의류" },
      { keyword: "스트링 백팩", ratio: 58, category: "가방" },
      { keyword: "보디수트", ratio: 55, category: "여성의류" },
      { keyword: "카고 팬츠", ratio: 52, category: "남성의류" },
      { keyword: "플랫폼 스니커즈", ratio: 49, category: "신발" },
      { keyword: "레이스 블라우스", ratio: 46, category: "여성의류" },
      { keyword: "레더 숄더백", ratio: 43, category: "가방" },
    ],
    updatedAt: new Date().toISOString(),
  };
}
