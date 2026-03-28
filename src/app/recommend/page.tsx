"use client";

import { useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";
import OutfitCard from "@/components/OutfitCard";

interface RecommendItem {
  name: string;
  category: string;
  color?: string;
  fit?: string;
  products?: Array<{
    title: string;
    image: string;
    price: number;
    link: string;
    mall: string;
  }>;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  items: RecommendItem[];
  tags: string[];
  occasion?: string;
}

export default function RecommendPage() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRecommend = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend");
      if (res.status === 401) {
        setError("로그인이 필요합니다.");
        return;
      }
      if (!res.ok) {
        setError("추천을 가져오는데 실패했습니다.");
        return;
      }
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">AI 코디 추천</h1>
        <p className="text-sm text-gray-500">당신에게 어울리는 코디를 AI가 추천해드려요</p>
      </div>

      {/* 추천 받기 버튼 */}
      <button
        onClick={handleRecommend}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-4 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400"
      >
        <HiSparkles className="text-xl" />
        {loading ? "AI가 분석 중... (10~20초 소요)" : "코디 추천받기"}
      </button>

      {/* 에러 */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 프로필 미완성 안내 */}
      {!recommendations && !loading && !error && (
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-center">
          <HiSparkles className="mx-auto mb-3 text-4xl text-gray-300" />
          <p className="text-sm text-gray-500">프로필을 먼저 완성하면</p>
          <p className="text-sm text-gray-500">더 정확한 코디를 추천받을 수 있어요</p>
          <Link
            href="/profile"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            프로필 설정하기 →
          </Link>
        </div>
      )}

      {/* 로딩 스켈레톤 */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-5">
              <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
              <div className="mb-2 h-4 w-full rounded bg-gray-100" />
              <div className="mb-4 h-4 w-2/3 rounded bg-gray-100" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="h-4 w-10 rounded bg-gray-100" />
                    <div className="h-4 w-32 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 추천 결과 */}
      {recommendations && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{recommendations.length}개의 코디를 추천받았어요</p>
          {recommendations.map((rec) => (
            <OutfitCard
              key={rec.id}
              id={rec.id}
              title={rec.title}
              description={rec.description}
              items={rec.items}
              tags={rec.tags}
              occasion={rec.occasion}
            />
          ))}
        </div>
      )}
    </div>
  );
}
