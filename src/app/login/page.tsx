"use client";

import { HiSparkles } from "react-icons/hi2";

export default function LoginPage() {
  const handleKakaoLogin = () => {
    window.location.href = "/api/auth/signin/kakao";
  };

  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* 로고 */}
        <div>
          <HiSparkles className="mx-auto mb-4 text-5xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">StyleMate</h1>
          <p className="mt-2 text-sm text-gray-500">AI가 추천하는 나만의 코디</p>
        </div>

        {/* 카카오 로그인 */}
        <button
          onClick={handleKakaoLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-colors"
          style={{ backgroundColor: "#FEE500", color: "#191919" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 1C4.58 1 1 3.87 1 7.36c0 2.27 1.47 4.26 3.68 5.37-.16.57-.59 2.06-.67 2.38-.1.39.14.39.3.28.12-.08 1.93-1.31 2.7-1.84.63.09 1.29.14 1.99.14 4.42 0 8-2.87 8-6.33S13.42 1 9 1z"
              fill="#191919"
            />
          </svg>
          카카오로 시작하기
        </button>

        <p className="text-xs text-gray-400">
          로그인하면 서비스 이용약관에 동의하게 됩니다
        </p>
      </div>
    </div>
  );
}
