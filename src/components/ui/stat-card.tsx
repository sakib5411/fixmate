import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "brand" | "sky" | "emerald" | "violet" | "ink";
}

const TONES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  brand: "bg-brand-50 text-brand-600",
  sky: "bg-sky-50 text-sky-600",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  ink: "bg-ink-100 text-ink-700",
};

export function StatCard({ label, value, icon: Icon, hint, tone = "brand" }: StatCardProps) {
  return (
    <div className="dash-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${TONES[tone]}`}>
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
}
