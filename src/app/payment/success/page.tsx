"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BadgeCheck, CheckCircle2, Loader2, ReceiptText, XCircle } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ApiError, apiGet } from "@/lib/api";
import { formatMoney } from "@/lib/format";

interface VerificationResult {
  bookingId: string;
  serviceTitle: string;
  amount: number;
  currency: string;
  transactionId: string;
}

function Verification() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      setMessage("Missing Stripe session id.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await apiGet<VerificationResult>(
          `/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`
        );
        if (cancelled) return;
        setResult(response.data);
        setState("done");
      } catch (error) {
        if (cancelled) return;
        setState("error");
        setMessage(error instanceof ApiError ? error.message : "Could not verify the payment");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-3xl border border-ink-200 bg-white p-8 text-center shadow-sm">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto size-9 animate-spin text-brand-500" />
            <h1 className="mt-5 text-xl font-semibold text-ink-900">Verifying your payment…</h1>
            <p className="mt-2 text-sm text-ink-500">
              Please keep this page open while we confirm the transaction with Stripe.
            </p>
          </>
        )}

        {state === "done" && result && (
          <>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-8" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink-900">
              Payment successful
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              Your repair is paid and the technician has been notified.
            </p>

            <dl className="mt-6 space-y-3 rounded-2xl bg-ink-50 p-5 text-left text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Service</dt>
                <dd className="text-right font-semibold text-ink-900">{result.serviceTitle}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Amount paid</dt>
                <dd className="font-semibold text-ink-900">
                  {formatMoney(result.amount, result.currency)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Transaction ID</dt>
                <dd className="max-w-[60%] truncate font-mono text-xs font-semibold text-ink-800">
                  {result.transactionId}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/dashboard/customer/bookings" className="btn-primary">
                <ReceiptText className="size-4" /> Back to My Bookings
              </Link>
              <Link href="/dashboard/customer/payments" className="btn-outline">
                View payment history
              </Link>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-red-50 text-red-600">
              <XCircle className="size-8" />
            </span>
            <h1 className="mt-5 text-xl font-semibold text-ink-900">
              We could not verify this payment
            </h1>
            <p className="mt-2 text-sm text-ink-500">{message}</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/dashboard/customer/bookings" className="btn-primary">
                Back to My Bookings
              </Link>
              <Link href="/services" className="btn-outline">
                Browse services
              </Link>
            </div>
          </>
        )}

        <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-ink-400">
          <BadgeCheck className="size-3.5" /> Payments are processed securely by Stripe
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-[70vh] items-center justify-center">
              <Loader2 className="size-8 animate-spin text-brand-500" />
            </div>
          }
        >
          <Verification />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
