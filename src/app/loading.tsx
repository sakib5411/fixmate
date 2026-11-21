import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
      <Loader2 className="size-8 animate-spin text-brand-500" />
      <p className="text-sm font-medium text-ink-500">Loading FixMate…</p>
    </div>
  );
}
