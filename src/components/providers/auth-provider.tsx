"use client";

import { createContext, useContext, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/types";

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending, refetch } = authClient.useSession();

  const user = (data?.user as unknown as SessionUser | undefined) ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isPending,
        refresh: async () => {
          await refetch();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

/** The dashboard each role should land on. */
export function dashboardFor(role: SessionUser["role"]): string {
  return role === "admin"
    ? "/dashboard/admin"
    : role === "technician"
      ? "/dashboard/technician"
      : "/dashboard/customer";
}
