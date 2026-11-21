"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { PageLoader } from "@/components/ui/loaders";
import { dashboardFor, useAuth } from "@/components/providers/auth-provider";

/**
 * Payment pages are customer-only. Signed-out visitors are sent to sign in
 * (and returned here afterwards); other roles go to their own dashboard.
 */
export function CustomerGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // Keep the Stripe session_id in the return URL so verification can
      // continue right after the customer signs in.
      const target = `${window.location.pathname}${window.location.search}`;
      router.replace(`/sign-in?redirect=${encodeURIComponent(target)}`);
      return;
    }
    if (user.role !== "customer") {
      router.replace(dashboardFor(user.role));
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "customer") {
    return <PageLoader label="Checking your session…" />;
  }

  return <>{children}</>;
}
