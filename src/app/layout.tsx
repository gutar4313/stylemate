import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "StyleMate - AI 코디 추천",
  description: "AI가 분석한 나만의 맞춤 코디 추천 서비스",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-gray-50 antialiased">
        <div className="mx-auto max-w-lg">
          <main className="px-4 pt-4 pb-20">{children}</main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
