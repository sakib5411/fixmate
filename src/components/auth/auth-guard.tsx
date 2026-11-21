"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { dashboardFor, useAuth } from "@/components/providers/auth-provider";

/**
 * Sign in / Sign up are public pages, but a visitor who is already signed in
 * should never see them again — send them straight to their own dashboard.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace(dashboardFor(user.role));
    }
  }, [loading, user, router]);

  if (loading || user) {
    return <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />;
  }

  return <>{children}</>;
}
