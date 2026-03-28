"use client";

import { IoBodyOutline, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

interface BodyAnalysis {
  bodyType: string;
  characteristics: string[];
  fashionTips: string[];
  avoidItems: string[];
}

interface BodyAnalysisResultProps {
  analysis: BodyAnalysis;
}

export default function BodyAnalysisResult({ analysis }: BodyAnalysisResultProps) {
  return (
    <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      {/* 체형 타입 */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <IoBodyOutline className="text-2xl text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">분석된 체형</p>
          <p className="text-lg font-bold text-gray-900">{analysis.bodyType}</p>
        </div>
      </div>

      {/* 특징 */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">체형 특징</p>
        <ul className="space-y-1">
          {analysis.characteristics.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-0.5 text-blue-400">•</span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* 추천 팁 */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">스타일링 팁</p>
        <ul className="space-y-1">
          {analysis.fashionTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <IoCheckmarkCircle className="mt-0.5 flex-shrink-0 text-green-500" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* 피할 아이템 */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">피하면 좋은 아이템</p>
        <ul className="space-y-1">
          {analysis.avoidItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <IoCloseCircle className="mt-0.5 flex-shrink-0 text-red-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
