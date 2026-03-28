"use client";

import { useState } from "react";
import Image from "next/image";
import { IoHeart, IoHeartOutline, IoOpenOutline } from "react-icons/io5";

interface Product {
  title: string;
  image: string;
  price: number;
  link: string;
  mall: string;
}

interface OutfitItem {
  name: string;
  category: string;
  color?: string;
  fit?: string;
  products?: Product[];
}

interface OutfitCardProps {
  id: string;
  title: string;
  description: string;
  items: OutfitItem[];
  tags: string[];
  occasion?: string;
  initialLiked?: boolean;
  onLike?: (id: string, liked: boolean) => void;
}

export default function OutfitCard({
  id,
  title,
  description,
  items,
  tags,
  occasion,
  initialLiked = false,
  onLike,
}: OutfitCardProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [expanded, setExpanded] = useState(false);

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    onLike?.(id, newLiked);

    if (newLiked) {
      try {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, items, tags }),
        });
      } catch {
        setLiked(false);
      }
    }
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      {/* 헤더 */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{title}</h3>
            {occasion && (
              <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                {occasion}
              </span>
            )}
          </div>
          <button
            onClick={handleLike}
            className={`text-2xl transition-all ${liked ? "scale-110 text-red-500" : "text-gray-300 hover:text-red-400"}`}
          >
            {liked ? <IoHeart /> : <IoHeartOutline />}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>

      {/* 아이템 목록 */}
      <div className="px-4 pb-2">
        {items.map((item, idx) => (
          <div key={idx} className="border-t border-gray-50 py-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500">
                {item.category}
              </span>
              <span className="font-medium text-gray-800">{item.name}</span>
              {item.color && <span className="text-xs text-gray-400">{item.color}</span>}
            </div>

            {/* 상품 이미지 (확장시) */}
            {expanded && item.products && item.products.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {item.products.map((product, pIdx) => (
                  <a
                    key={pIdx}
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <div className="w-24 overflow-hidden rounded-lg border border-gray-100">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={96}
                        height={96}
                        className="h-24 w-24 object-cover"
                      />
                      <div className="p-1.5">
                        <p className="truncate text-xs text-gray-700">{product.title}</p>
                        <p className="text-xs font-bold text-blue-600">
                          {product.price.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 하단: 태그 + 상품보기 */}
      <div className="flex items-center justify-between border-t border-gray-50 px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              #{tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          <IoOpenOutline />
          {expanded ? "접기" : "상품보기"}
        </button>
      </div>
    </div>
  );
}
