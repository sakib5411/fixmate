import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-4 py-16 text-center">
      <Logo />
      <div className="relative mt-10">
        <span className="text-[7rem] leading-none font-bold tracking-tight text-ink-200 sm:text-[9rem]">
          404
        </span>
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-20 place-items-center rounded-3xl bg-brand-500 text-white shadow-xl shadow-brand-500/30">
            <Wrench className="size-10" />
          </span>
        </span>
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
        This page needs a repair
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink-500">
        The page you are looking for may have been moved, removed, or the service is no longer
        available.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          <ArrowLeft className="size-4" /> Back to Home
        </Link>
        <Link href="/services" className="btn-outline">
          Browse services
        </Link>
      </div>
    </main>
  );
}
