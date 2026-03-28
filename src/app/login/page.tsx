"use client";

import { HiSparkles } from "react-icons/hi2";

export default function LoginPage() {
  const handleNaverLogin = () => {
    window.location.href = "/api/auth/signin/naver";
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

        {/* 네이버 로그인 */}
        <button
          onClick={handleNaverLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl py-3.5 text-sm font-bold transition-colors hover:opacity-90"
          style={{ backgroundColor: "#03C75A", color: "#FFFFFF" }}
        >
          {/* 네이버 N 로고 */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" fill="white" />
          </svg>
          네이버로 시작하기
        </button>

        <p className="text-xs text-gray-400">
          로그인하면 서비스 이용약관에 동의하게 됩니다
        </p>
      </div>
    </div>
  );
}
