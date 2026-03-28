"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { IoSearchOutline } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";

export default function SearchPage() {
  const [searchImage, setSearchImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<null | Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    items: Array<{ name: string; category: string }>;
  }>>(null);

  const handleSearch = async () => {
    if (!searchImage) {
      alert("사진을 먼저 업로드해주세요.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", searchImage);

      const res = await fetch("/api/search-by-image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
      }
    } catch {
      alert("검색에 실패했습니다.");
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

      {/* 이미지 업로드 */}
      <ImageUploader
        onImageSelect={setSearchImage}
        label="코디 사진 업로드"
      />

      {/* 검색 버튼 */}
      <button
        onClick={handleSearch}
        disabled={!searchImage || loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
      >
        <IoSearchOutline className="text-lg" />
        {loading ? "AI가 분석 중..." : "비슷한 코디 찾기"}
      </button>

      {/* 로딩 */}
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

      {/* 검색 결과 */}
      {results && (
        <div className="space-y-4">
          <h2 className="font-bold text-gray-900">비슷한 코디 {results.length}개</h2>
          {results.map((result) => (
            <div key={result.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-bold text-gray-900">{result.title}</h3>
                <button className="text-xl text-gray-300 transition-colors hover:text-red-500">
                  <IoHeartOutline />
                </button>
              </div>
              <p className="mb-3 text-sm text-gray-600">{result.description}</p>
              <div className="mb-3 space-y-1">
                {result.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-xs text-gray-400">{item.category}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {result.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 기본 안내 */}
      {!results && !loading && (
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-center">
          <IoSearchOutline className="mx-auto mb-3 text-4xl text-gray-300" />
          <p className="text-sm text-gray-500">마음에 드는 코디 사진을 업로드하면</p>
          <p className="text-sm text-gray-500">AI가 비슷한 조합을 찾아드려요</p>
        </div>
      )}
    </div>
  );
}
