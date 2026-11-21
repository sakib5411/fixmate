import type { ReactNode } from "react";
import { BadgeCheck, ShieldCheck, Wallet } from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Logo } from "@/components/brand/logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
          <div className="mt-8">
            <AuthGuard>{children}</AuthGuard>
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-ink-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-brand-500/20 blur-3xl" />
        <Logo tone="light" />

        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Repairs with a timeline and a fair payment.
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              { icon: BadgeCheck, text: "Every technician is verified before listing services." },
              { icon: Wallet, text: "Pay only after the job is completed and priced." },
              { icon: ShieldCheck, text: "Server-enforced job stages, no skipped steps." },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-3 text-sm text-ink-300">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-brand-400">
                  <item.icon className="size-4" />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-ink-500">
          FixMate · Device & home appliance repair platform
        </p>
      </div>
    </div>
  );
}
