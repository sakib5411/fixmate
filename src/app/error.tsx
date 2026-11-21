"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-4 py-16 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-red-50 text-red-600">
        <AlertTriangle className="size-8" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink-500">
        An unexpected error stopped this page from loading. Try again, or head back home and
        continue browsing.
      </p>
      {error.digest && (
        <p className="mt-3 rounded-full bg-white px-3 py-1 font-mono text-xs text-ink-400 ring-1 ring-ink-200">
          {error.digest}
        </p>
      )}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          <RotateCcw className="size-4" /> Try again
        </button>
        <Link href="/" className="btn-outline">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
