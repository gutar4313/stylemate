"use client";

import { useEffect, useState } from "react";
import { IoShirtOutline, IoHeart, IoTrashOutline } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";
import OutfitCard from "@/components/OutfitCard";

interface SavedOutfit {
  id: string;
  title: string;
  description: string;
  items: Array<{ name: string; category: string }>;
  tags: string[];
  savedAt: string;
}

export default function ClosetPage() {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarRecs, setSimilarRecs] = useState<Array<{
    id: string; title: string; description: string;
    items: Array<{ name: string; category: string }>; tags: string[];
  }> | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setOutfits(data);
      }
    } catch {
      // 로그인 안 된 경우 등
    } finally {
      setLoading(false);
    }
  };

  const handleSimilar = async () => {
    setSimilarLoading(true);
    try {
      const res = await fetch("/api/recommend/similar");
      if (res.ok) {
        const data = await res.json();
        setSimilarRecs(data.recommendations);
      } else {
        alert("비슷한 스타일을 가져오지 못했습니다.");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setSimilarLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/favorites?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setOutfits((prev) => prev.filter((o) => o.id !== id));
      }
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">내 옷장</h1>
          <p className="text-sm text-gray-500">저장한 코디를 확인하세요</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-5">
              <div className="mb-2 h-5 w-1/2 rounded bg-gray-200" />
              <div className="h-4 w-3/4 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">내 옷장</h1>
        <p className="text-sm text-gray-500">
          {outfits.length > 0 ? `${outfits.length}개의 코디가 저장되어 있어요` : "저장한 코디를 확인하세요"}
        </p>
      </div>

      {outfits.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-10 text-center">
          <IoShirtOutline className="mx-auto mb-3 text-5xl text-gray-300" />
          <p className="text-sm font-medium text-gray-500">아직 저장한 코디가 없어요</p>
          <p className="mt-1 text-xs text-gray-400">
            코디 추천에서 <IoHeart className="inline text-red-400" /> 를 눌러 저장해보세요
          </p>
        </div>
      ) : (
        <>
        {/* 비슷한 스타일 추천 버튼 */}
        <button
          onClick={handleSimilar}
          disabled={similarLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-violet-400 bg-violet-50 py-3 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100 disabled:opacity-50"
        >
          <HiSparkles />
          {similarLoading ? "AI가 분석 중..." : "저장 코디 기반 비슷한 스타일 추천"}
        </button>

        {/* 비슷한 추천 결과 */}
        {similarRecs && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">취향 기반 추천</p>
            {similarRecs.map((rec) => (
              <OutfitCard
                key={rec.id}
                id={rec.id}
                title={rec.title}
                description={rec.description}
                items={rec.items}
                tags={rec.tags}
              />
            ))}
          </div>
        )}
        </>
      )}
      {outfits.length > 0 && (
        <div className="space-y-3">
          {outfits.map((outfit) => (
            <div key={outfit.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-bold text-gray-900">{outfit.title}</h3>
                <button
                  onClick={() => handleDelete(outfit.id)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <IoTrashOutline />
                </button>
              </div>
              {outfit.description && (
                <p className="mb-2 text-sm text-gray-600">{outfit.description}</p>
              )}
              <div className="mb-2 space-y-1">
                {outfit.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                      {item.category}
                    </span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {(outfit.tags as string[]).map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(outfit.savedAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
