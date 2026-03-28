"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoHomeOutline, IoHome, IoSearchOutline, IoSearch, IoShirtOutline, IoShirt, IoPersonOutline, IoPerson } from "react-icons/io5";
import { HiOutlineSparkles, HiSparkles } from "react-icons/hi2";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: IoHomeOutline, activeIcon: IoHome },
  { href: "/recommend", label: "추천", icon: HiOutlineSparkles, activeIcon: HiSparkles },
  { href: "/search", label: "검색", icon: IoSearchOutline, activeIcon: IoSearch },
  { href: "/closet", label: "옷장", icon: IoShirtOutline, activeIcon: IoShirt },
  { href: "/profile", label: "프로필", icon: IoPersonOutline, activeIcon: IoPerson },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon, activeIcon: ActiveIcon }) => {
          const isActive = pathname === href;
          const IconComponent = isActive ? ActiveIcon : Icon;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <IconComponent className="text-xl" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
