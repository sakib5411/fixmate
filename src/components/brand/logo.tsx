import Link from "next/link";
import { Wrench } from "lucide-react";

interface LogoProps {
  href?: string;
  tone?: "dark" | "light";
  className?: string;
}

/** The FixMate lockup — identical size and style on every page. */
export function Logo({ href = "/", tone = "dark", className = "" }: LogoProps) {
  const mark = (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-brand-500 text-white shadow-sm shadow-brand-500/30">
        <Wrench className="size-5" strokeWidth={2.4} />
      </span>
      <span
        className={`text-xl font-semibold tracking-tight ${
          tone === "light" ? "text-white" : "text-ink-900"
        }`}
      >
        Fix<span className="text-brand-500">Mate</span>
      </span>
    </span>
  );

  if (!href) return <span className={className}>{mark}</span>;

  return (
    <Link href={href} className={`transition-opacity hover:opacity-90 ${className}`}>
      {mark}
    </Link>
  );
}
