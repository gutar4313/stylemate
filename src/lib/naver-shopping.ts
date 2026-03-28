interface NaverShoppingItem {
  title: string;
  link: string;
  image: string;
  lprice: string;
  hprice: string;
  mallName: string;
  productId: string;
  productType: string;
  brand: string;
  category1: string;
  category2: string;
  category3: string;
}

interface NaverShoppingResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverShoppingItem[];
}

export async function searchNaverShopping(
  query: string,
  display: number = 5
): Promise<NaverShoppingItem[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn("네이버 API 키가 설정되지 않았습니다.");
    return [];
  }

  try {
    const params = new URLSearchParams({
      query,
      display: String(display),
      sort: "sim",
    });

    const res = await fetch(
      `https://openapi.naver.com/v1/search/shop.json?${params}`,
      {
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
        },
      }
    );

    if (!res.ok) {
      console.error("네이버 쇼핑 API 오류:", res.status);
      return [];
    }

    const data: NaverShoppingResponse = await res.json();
    return data.items;
  } catch (error) {
    console.error("네이버 쇼핑 검색 실패:", error);
    return [];
  }
}

export function cleanHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}
