"use client";

import { useState, useEffect } from "react";

interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface SessionState {
  user: SessionUser | null;
  loading: boolean;
  isLoggedIn: boolean;
}

export function useSession(): SessionState {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setUser(data.user);
          }
        }
      } catch {
        // 무시
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  return { user, loading, isLoggedIn: !!user };
}
