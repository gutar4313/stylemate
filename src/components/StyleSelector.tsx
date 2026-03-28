"use client";

import { STYLE_TAGS, type StyleTag } from "@/types";

interface StyleSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelect?: number;
}

export default function StyleSelector({ selected, onChange, maxSelect = 5 }: StyleSelectorProps) {
  const toggle = (tag: StyleTag) => {
    if (selected.includes(tag.id)) {
      onChange(selected.filter((s) => s !== tag.id));
    } else if (selected.length < maxSelect) {
      onChange([...selected, tag.id]);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        선호 스타일 (최대 {maxSelect}개)
      </label>
      <div className="flex flex-wrap gap-2">
        {STYLE_TAGS.map((tag) => {
          const isSelected = selected.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggle(tag)}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <span className="mr-1">{tag.emoji}</span>
              {tag.label}
            </button>
          );
        })}
      </div>
      <p className="mt-1 text-xs text-gray-400">
        {selected.length}/{maxSelect}개 선택됨
      </p>
    </div>
  );
}
