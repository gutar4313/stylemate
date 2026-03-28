"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import OutfitCard from "@/components/OutfitCard";
import LoginPrompt from "@/components/LoginPrompt";
import { useSession } from "@/hooks/useSession";
import { IoSearchOutline } from "react-icons/io5";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  tags: string[];
  items: Array<{
    name: string;
    category: string;
    color?: string;
    style?: string;
    material?: string;
    products?: Array<{
      title: string;
      image: string;
      price: number;
      link: string;
      mall: string;
    }>;
  }>;
}

export default function SearchPage() {
  const { isLoggedIn, loading: sessionLoading } = useSession();
  const [searchImage, setSearchImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchImage) {
      alert("사진을 먼저 업로드해주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", searchImage);

      const res = await fetch("/api/search-by-image", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        setError("로그인이 필요합니다.");
        return;
      }
      if (!res.ok) {
        setError("검색에 실패했습니다.");
        return;
      }

      const data = await res.json();
      setResults(data.results);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">사진으로 코디 검색</h1>
        <p className="text-sm text-gray-500">사진을 찍어서 비슷한 코디를 찾아보세요</p>
      </div>

      {!sessionLoading && !isLoggedIn && (
        <LoginPrompt message="사진 검색을 하려면 로그인이 필요해요" />
      )}

      <ImageUploader onImageSelect={setSearchImage} label="코디 사진 업로드" />

      <button
        onClick={handleSearch}
        disabled={!searchImage || loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
      >
        <IoSearchOutline className="text-lg" />
        {loading ? "AI가 분석 중... (10~20초 소요)" : "비슷한 코디 찾기"}
      </button>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-5">
              <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
              <div className="mb-2 h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-2/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <h2 className="font-bold text-gray-900">분석 결과</h2>
          {results.map((result) => (
            <OutfitCard
              key={result.id}
              id={result.id}
              title={result.title}
              description={result.description}
              items={result.items}
              tags={result.tags}
            />
          ))}
        </div>
      )}

      {!results && !loading && !error && (
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-center">
          <IoSearchOutline className="mx-auto mb-3 text-4xl text-gray-300" />
          <p className="text-sm text-gray-500">마음에 드는 코디 사진을 업로드하면</p>
          <p className="text-sm text-gray-500">AI가 비슷한 상품을 찾아드려요</p>
        </div>
      )}
    </div>
  );
}
