"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Check, Eye, EyeOff, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { dashboardFor } from "@/components/providers/auth-provider";
import type { Role, SessionUser } from "@/lib/types";

const ROLES: { value: Extract<Role, "customer" | "technician">; title: string; copy: string; icon: typeof UserRound }[] = [
  {
    value: "customer",
    title: "Customer",
    copy: "Book repairs and pay after the job is done.",
    icon: UserRound,
  },
  {
    value: "technician",
    title: "Technician",
    copy: "List your services and manage incoming jobs.",
    icon: Wrench,
  },
];

export function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rules = [
    { label: "At least 6 characters", ok: password.length >= 6 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(password) },
  ];

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Enter your full name";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email address";
    if (!rules.every((rule) => rule.ok))
      next.password = "Password must be 6+ characters with uppercase and lowercase letters";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // `role` is a BetterAuth additionalField; admin is rejected server-side.
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      } as unknown as { name: string; email: string; password: string });

      if (result.error) {
        toast.error(
          result.error.message?.toLowerCase().includes("exist")
            ? "An account with this email already exists"
            : (result.error.message ?? "Could not create your account")
        );
        return;
      }

      const signIn = await authClient.signIn.email({ email: email.trim(), password });

      if (signIn.error) {
        toast.success("Account created. Please sign in.");
        router.replace("/sign-in");
        return;
      }

      const signedRole = ((signIn.data?.user as unknown as SessionUser | undefined)?.role ??
        role) as Role;

      toast.success(`Welcome to FixMate, ${name.split(" ")[0]}!`);
      router.replace(dashboardFor(signedRole));
      router.refresh();
    } catch {
      toast.error("Could not create your account. Please check that the API is running.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <label className="label" htmlFor="signup-name">
          Full name
        </label>
        <input
          id="signup-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your full name"
          className="input"
          autoComplete="name"
        />
        {errors.name && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label className="label" htmlFor="signup-email">
          Email address
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="input"
          autoComplete="email"
        />
        {errors.email && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className="label" htmlFor="signup-password">
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
            className="input pr-11"
            autoComplete="new-password"
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
        <ul className="mt-2 grid gap-1 sm:grid-cols-3">
          {rules.map((rule) => (
            <li
              key={rule.label}
              className={`flex items-center gap-1.5 text-[11px] font-medium ${
                rule.ok ? "text-emerald-600" : "text-ink-400"
              }`}
            >
              <Check className="size-3" /> {rule.label}
            </li>
          ))}
        </ul>
        {errors.password && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <span className="label">I want to join as</span>
        <div className="grid gap-3 sm:grid-cols-2">
          {ROLES.map((option) => {
            const selected = role === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  selected
                    ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20"
                    : "border-ink-200 bg-white hover:border-ink-300"
                }`}
                aria-pressed={selected}
              >
                <span className="flex items-center justify-between">
                  <option.icon
                    className={`size-5 ${selected ? "text-brand-600" : "text-ink-500"}`}
                  />
                  {selected && <Check className="size-4 text-brand-600" />}
                </span>
                <span className="mt-2 block text-sm font-semibold text-ink-900">
                  {option.title}
                </span>
                <span className="mt-0.5 block text-xs text-ink-500">{option.copy}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-400">
          <ShieldCheck className="size-3.5" /> Admin accounts are created by the platform team only.
        </p>
      </div>

      <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
        {submitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}
