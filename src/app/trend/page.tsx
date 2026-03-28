"use client";

import { useEffect, useState } from "react";
import { IoTrendingUpOutline, IoRefreshOutline } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";

interface TrendKeyword {
  keyword: string;
  ratio: number;
  category: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  여성의류: "bg-pink-100 text-pink-700",
  남성의류: "bg-blue-100 text-blue-700",
  신발: "bg-amber-100 text-amber-700",
  가방: "bg-violet-100 text-violet-700",
};

export default function TrendPage() {
  const [keywords, setKeywords] = useState<TrendKeyword[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  const categories = ["전체", "여성의류", "남성의류", "신발", "가방"];

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trends");
      if (res.ok) {
        const data = await res.json();
        setKeywords(data.keywords);
        setUpdatedAt(data.updatedAt);
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    selectedCategory === "전체"
      ? keywords
      : keywords.filter((k) => k.category === selectedCategory);

  const maxRatio = Math.max(...keywords.map((k) => k.ratio), 1);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">트렌드</h1>
          <p className="text-sm text-gray-500">
            {updatedAt
              ? `${new Date(updatedAt).toLocaleDateString("ko-KR")} 기준`
              : "지금 인기 있는 패션 키워드"}
          </p>
        </div>
        <button
          onClick={fetchTrends}
          disabled={loading}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <IoRefreshOutline className={`text-xl ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* AI 추천 배너 */}
      <Link
        href="/recommend"
        className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 p-4 text-white shadow-md active:scale-[0.98] transition-transform"
      >
        <HiSparkles className="text-2xl flex-shrink-0" />
        <div>
          <p className="text-sm font-bold">트렌드 기반 코디 추천받기</p>
          <p className="text-xs text-blue-100">내 체형에 맞는 최신 트렌드 코디</p>
        </div>
      </Link>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 트렌드 키워드 목록 */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="ml-auto h-4 w-16 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((kw, idx) => (
            <div key={`${kw.keyword}-${idx}`} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                {/* 순위 */}
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    idx === 0
                      ? "bg-amber-400 text-white"
                      : idx === 1
                      ? "bg-gray-300 text-white"
                      : idx === 2
                      ? "bg-amber-700 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 truncate">{kw.keyword}</span>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${CATEGORY_COLORS[kw.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {kw.category}
                    </span>
                  </div>
                  {/* 인기도 바 */}
                  <div className="h-1.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${(kw.ratio / maxRatio) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 검색 링크 */}
                <a
                  href={`https://search.naver.com/search.naver?query=${encodeURIComponent(kw.keyword)}&where=shopping`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  쇼핑
                </a>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center">
              <IoTrendingUpOutline className="mx-auto mb-2 text-4xl text-gray-300" />
              <p className="text-sm text-gray-500">해당 카테고리 트렌드가 없습니다</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
