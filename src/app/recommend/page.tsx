"use client";

import { useState, useEffect } from "react";
import { HiSparkles } from "react-icons/hi2";
import { IoTimeOutline } from "react-icons/io5";
import Link from "next/link";
import OutfitCard from "@/components/OutfitCard";
import LoginPrompt from "@/components/LoginPrompt";
import { useSession } from "@/hooks/useSession";

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

interface HistoryEntry {
  id: string;
  result: Recommendation[];
  createdAt: string;
}

export default function RecommendPage() {
  const { isLoggedIn, loading: sessionLoading } = useSession();
  const [tab, setTab] = useState<"new" | "history">("new");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // 이력 탭 열면 로드
  useEffect(() => {
    if (tab === "history" && history.length === 0 && isLoggedIn) {
      loadHistory();
    }
  }, [tab, isLoggedIn, history.length]);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/recommend/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } finally {
      setHistoryLoading(false);
    }
  };

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

      {/* 비로그인 안내 */}
      {!sessionLoading && !isLoggedIn && (
        <LoginPrompt message="코디 추천을 받으려면 로그인이 필요해요" />
      )}

      {/* 탭 */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => setTab("new")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            tab === "new" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
          }`}
        >
          새 추천
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-sm font-medium transition-all ${
            tab === "history" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
          }`}
        >
          <IoTimeOutline />
          추천 이력
        </button>
      </div>

      {/* 새 추천 탭 */}
      {tab === "new" && (
        <>
          <button
            onClick={handleRecommend}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-4 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400"
          >
            <HiSparkles className="text-xl" />
            {loading ? "AI가 분석 중... (10~20초 소요)" : "코디 추천받기"}
          </button>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
              {error}
            </div>
          )}

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
        </>
      )}

      {/* 추천 이력 탭 */}
      {tab === "history" && (
        <>
          {historyLoading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse rounded-xl bg-white p-5">
                  <div className="mb-2 h-4 w-1/3 rounded bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          )}

          {!historyLoading && history.length === 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
              <IoTimeOutline className="mx-auto mb-2 text-4xl text-gray-300" />
              <p className="text-sm text-gray-500">아직 추천 이력이 없어요</p>
              <button
                onClick={() => setTab("new")}
                className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                첫 추천 받으러 가기 →
              </button>
            </div>
          )}

          {history.map((entry) => (
            <div key={entry.id} className="space-y-3">
              <p className="text-xs text-gray-400">
                {new Date(entry.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {(entry.result as Recommendation[]).map((rec, idx) => (
                <OutfitCard
                  key={`${entry.id}-${idx}`}
                  id={`${entry.id}-${idx}`}
                  title={rec.title}
                  description={rec.description}
                  items={rec.items}
                  tags={rec.tags}
                  occasion={rec.occasion}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
