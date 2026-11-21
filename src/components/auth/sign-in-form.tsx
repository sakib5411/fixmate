"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { dashboardFor } from "@/components/providers/auth-provider";
import type { Role, SessionUser } from "@/lib/types";

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  /** Only same-origin relative paths are safe post-login destinations. */
  function safeRedirect(target: string | null, role: Role): string {
    const fallback = dashboardFor(role);
    if (!target || !target.startsWith("/") || target.startsWith("//")) return fallback;
    try {
      const url = new URL(target, window.location.origin);
      if (url.origin !== window.location.origin) return fallback;
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return fallback;
    }
  }

  function validate(): boolean {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(result.error.message ?? "Invalid email or password");
        return;
      }

      const role = ((result.data?.user as unknown as SessionUser | undefined)?.role ??
        "customer") as Role;

      toast.success("Welcome back to FixMate");
      router.replace(safeRedirect(redirectTo, role));
      router.refresh();
    } catch {
      toast.error("Could not sign in. Please check that the API is running.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <label className="label" htmlFor="signin-email">
          Email address
        </label>
        <input
          id="signin-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="input"
        />
        {errors.email && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className="label" htmlFor="signin-password">
          Password
        </label>
        <div className="relative">
          <input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            className="input pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-400 hover:text-ink-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.password}</p>
        )}
      </div>

      <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
        <LogIn className="size-4" /> {submitting ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-sm text-ink-500">
        New to FixMate?{" "}
        <Link href="/sign-up" className="font-semibold text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </p>
    </form>
  );
}
