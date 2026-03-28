import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";
import { IoSearchOutline, IoTrendingUpOutline } from "react-icons/io5";

async function getTrends() {
  try {
    const { getNaverShoppingTrends } = await import("@/lib/naver-datalab");
    return await getNaverShoppingTrends();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const trends = await getTrends();
  const topKeywords = trends?.keywords.slice(0, 6) ?? [];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">StyleMate</h1>
          <p className="text-sm text-gray-500">AI가 추천하는 나만의 코디</p>
        </div>
        <Link
          href="/trend"
          className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 border border-amber-200"
        >
          <IoTrendingUpOutline />
          트렌드
        </Link>
      </div>

      {/* 메인 CTA */}
      <Link
        href="/recommend"
        className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-5 text-white shadow-lg transition-transform active:scale-[0.98]"
      >
        <HiSparkles className="text-4xl flex-shrink-0" />
        <div>
          <p className="text-lg font-bold">AI 코디 추천받기</p>
          <p className="text-sm text-blue-100">체형과 스타일에 맞는 코디를 추천해드려요</p>
        </div>
      </Link>

      {/* 퀵 메뉴 */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/search"
          className="flex flex-col items-center gap-2 rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          <IoSearchOutline className="text-3xl text-blue-600" />
          <span className="text-sm font-medium text-gray-700">사진으로 검색</span>
          <span className="text-xs text-gray-400">비슷한 코디 찾기</span>
        </Link>

        <Link
          href="/closet"
          className="flex flex-col items-center gap-2 rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          <HiSparkles className="text-3xl text-violet-600" />
          <span className="text-sm font-medium text-gray-700">비슷한 스타일</span>
          <span className="text-xs text-gray-400">저장 코디 기반 추천</span>
        </Link>
      </div>

      {/* 지금 인기 키워드 */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IoTrendingUpOutline className="text-lg text-amber-500" />
            <h2 className="font-bold text-gray-900">지금 인기 키워드</h2>
          </div>
          <Link href="/trend" className="text-xs text-blue-500 hover:text-blue-700">
            전체보기
          </Link>
        </div>

        {topKeywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {topKeywords.map((kw, idx) => (
              <a
                key={kw.keyword}
                href={`https://search.naver.com/search.naver?query=${encodeURIComponent(kw.keyword)}&where=shopping`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:border-blue-200 hover:text-blue-600 transition-colors"
              >
                <span className={`text-xs font-bold ${idx < 3 ? "text-amber-500" : "text-gray-400"}`}>
                  {idx + 1}
                </span>
                {kw.keyword}
              </a>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["미니멀 룩", "올 블랙", "레이어드", "뉴트럴톤", "오피스 캐주얼"].map((trend) => (
              <div key={trend} className="flex-shrink-0 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
                {trend}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 프로필 완성 유도 */}
      <Link
        href="/profile"
        className="block rounded-xl border border-amber-200 bg-amber-50 p-4 transition-colors hover:bg-amber-100"
      >
        <p className="text-sm font-medium text-amber-800">프로필을 완성해주세요!</p>
        <p className="text-xs text-amber-600">체형 정보를 입력하면 더 정확한 코디를 추천받을 수 있어요</p>
      </Link>
    </div>
  );
}
