"use client";

import Link from "next/link";
import { IoLogInOutline } from "react-icons/io5";

interface LoginPromptProps {
  message?: string;
}

export default function LoginPrompt({ message = "이 기능을 사용하려면 로그인이 필요해요" }: LoginPromptProps) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">
      <IoLogInOutline className="mx-auto mb-2 text-3xl text-blue-500" />
      <p className="text-sm font-medium text-blue-800">{message}</p>
      <Link
        href="/login"
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        로그인하기
      </Link>
    </div>
  );
}
