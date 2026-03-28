"use client";

import { useState } from "react";
import { IoShirtOutline, IoHeart, IoTrashOutline } from "react-icons/io5";

interface SavedOutfit {
  id: string;
  title: string;
  description: string;
  tags: string[];
  savedAt: string;
}

export default function ClosetPage() {
  const [outfits] = useState<SavedOutfit[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">내 옷장</h1>
        <p className="text-sm text-gray-500">저장한 코디를 확인하세요</p>
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
        <div className="space-y-3">
          {outfits.map((outfit) => (
            <div key={outfit.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-bold text-gray-900">{outfit.title}</h3>
                <button className="text-gray-400 transition-colors hover:text-red-500">
                  <IoTrashOutline />
                </button>
              </div>
              <p className="mb-2 text-sm text-gray-600">{outfit.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {outfit.tags.map((tag) => (
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
