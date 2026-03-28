"use client";

import { useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import { IoHeartOutline } from "react-icons/io5";
import Link from "next/link";

export default function RecommendPage() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<null | Array<{
    id: string;
    title: string;
    description: string;
    items: Array<{ name: string; category: string }>;
    tags: string[];
  }>>(null);

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommend");
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations);
      }
    } catch {
      alert("추천을 가져오는데 실패했습니다.");
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
        {loading ? "AI가 분석 중..." : "코디 추천받기"}
      </button>

      {/* 프로필 미완성 알림 */}
      {!recommendations && !loading && (
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

      {/* 로딩 */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-5">
              <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
              <div className="mb-2 h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-2/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {/* 추천 결과 */}
      {recommendations && (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-bold text-gray-900">{rec.title}</h3>
                <button className="text-xl text-gray-300 transition-colors hover:text-red-500">
                  <IoHeartOutline />
                </button>
              </div>
              <p className="mb-3 text-sm text-gray-600">{rec.description}</p>
              <div className="mb-3 space-y-1">
                {rec.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-xs text-gray-400">{item.category}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {rec.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
