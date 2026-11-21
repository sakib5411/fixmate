import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your repairs and payments.">
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-ink-100" />}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
