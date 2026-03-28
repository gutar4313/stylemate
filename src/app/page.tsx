import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";
import { IoShirtOutline, IoSearchOutline, IoTrendingUpOutline } from "react-icons/io5";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-gray-900">StyleMate</h1>
        <p className="text-sm text-gray-500">AI가 추천하는 나만의 코디</p>
      </div>

      {/* 메인 CTA */}
      <Link
        href="/recommend"
        className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-5 text-white shadow-lg transition-transform active:scale-[0.98]"
      >
        <HiSparkles className="text-4xl" />
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
          <IoShirtOutline className="text-3xl text-violet-600" />
          <span className="text-sm font-medium text-gray-700">내 옷장</span>
          <span className="text-xs text-gray-400">저장한 코디 보기</span>
        </Link>
      </div>

      {/* 트렌드 섹션 */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <IoTrendingUpOutline className="text-lg text-amber-500" />
          <h2 className="font-bold text-gray-900">지금 인기 스타일</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["미니멀 룩", "올 블랙", "레이어드", "뉴트럴톤", "오피스 캐주얼"].map((trend) => (
            <div
              key={trend}
              className="flex-shrink-0 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm"
            >
              {trend}
            </div>
          ))}
        </div>
      </section>

      {/* 프로필 미완성 알림 */}
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
