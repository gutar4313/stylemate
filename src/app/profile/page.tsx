"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import StyleSelector from "@/components/StyleSelector";
import BodyAnalysisResult from "@/components/BodyAnalysisResult";
import { GENDERS, TOP_SIZES, BOTTOM_SIZES, SHOE_SIZES } from "@/types";
import { IoSaveOutline } from "react-icons/io5";
import { IoBodyOutline } from "react-icons/io5";

interface BodyAnalysis {
  bodyType: string;
  characteristics: string[];
  fashionTips: string[];
  avoidItems: string[];
}

export default function ProfilePage() {
  const [bodyPhoto, setBodyPhoto] = useState<File | null>(null);
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [topSize, setTopSize] = useState("");
  const [bottomSize, setBottomSize] = useState("");
  const [shoeSize, setShoeSize] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [bodyAnalysis, setBodyAnalysis] = useState<BodyAnalysis | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      if (bodyPhoto) formData.append("bodyPhoto", bodyPhoto);
      formData.append("gender", gender);
      formData.append("height", height);
      formData.append("weight", weight);
      formData.append("topSize", topSize);
      formData.append("bottomSize", bottomSize);
      formData.append("shoeSize", shoeSize);
      formData.append("styles", JSON.stringify(selectedStyles));

      const res = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("프로필이 저장되었습니다!");
      }
    } catch {
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const handleBodyAnalysis = async () => {
    if (!bodyPhoto) {
      alert("전신 사진을 먼저 업로드해주세요.");
      return;
    }
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", bodyPhoto);

      const res = await fetch("/api/analyze-body", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        alert("로그인이 필요합니다.");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setBodyAnalysis(data);
      } else {
        alert("체형 분석에 실패했습니다.");
      }
    } catch {
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">내 프로필</h1>
        <p className="text-sm text-gray-500">체형 정보를 입력해주세요</p>
      </div>

      {/* 전신 사진 */}
      <ImageUploader onImageSelect={setBodyPhoto} />

      {/* AI 체형 분석 버튼 */}
      {bodyPhoto && (
        <button
          onClick={handleBodyAnalysis}
          disabled={analyzing}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-violet-500 bg-violet-50 py-3 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100 disabled:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400"
        >
          <IoBodyOutline className="text-lg" />
          {analyzing ? "AI가 체형 분석 중... (10~20초)" : "AI 체형 분석하기"}
        </button>
      )}

      {/* 체형 분석 결과 */}
      {bodyAnalysis && <BodyAnalysisResult analysis={bodyAnalysis} />}

      {/* 성별 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">성별</label>
        <div className="flex gap-3">
          {GENDERS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGender(g.id)}
              className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-all ${
                gender === g.id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* 키 & 몸무게 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">키 (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">몸무게 (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="65"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 사이즈 */}
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">상의 사이즈</label>
          <div className="flex flex-wrap gap-2">
            {TOP_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setTopSize(size)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                  topSize === size
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">하의 사이즈 (인치)</label>
          <div className="flex flex-wrap gap-2">
            {BOTTOM_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setBottomSize(size)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                  bottomSize === size
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">신발 사이즈 (mm)</label>
          <div className="flex flex-wrap gap-2">
            {SHOE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setShoeSize(size)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                  shoeSize === size
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 선호 스타일 */}
      <StyleSelector selected={selectedStyles} onChange={setSelectedStyles} />

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
      >
        <IoSaveOutline className="text-lg" />
        {saving ? "저장 중..." : "프로필 저장하기"}
      </button>
    </div>
  );
}
