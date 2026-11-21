"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, CheckCircle2, Lock, Wrench, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiError, apiSend } from "@/lib/api";
import { todayInputValue } from "@/lib/format";
import type { Booking } from "@/lib/types";

interface RequestRepairProps {
  serviceId: string;
  serviceTitle: string;
  technicianName: string;
}

export function RequestRepair({ serviceId, serviceTitle, technicianName }: RequestRepairProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState(todayInputValue());
  const [problem, setProblem] = useState("");

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (loading) {
    return <div className="h-12 w-full animate-pulse rounded-full bg-ink-100" />;
  }

  if (!user) {
    return (
      <div className="space-y-3">
        <Link
          href={`/sign-in?redirect=${encodeURIComponent(pathname)}`}
          className="btn-primary w-full py-3"
        >
          <Wrench className="size-4" /> Sign in to request a repair
        </Link>
        <p className="flex items-center justify-center gap-1.5 text-xs text-ink-500">
          <Lock className="size-3.5" /> Free to sign up · pay only after the repair
        </p>
      </div>
    );
  }

  if (user.role !== "customer") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Only customers can request a repair. You are signed in as a {user.role}.
      </div>
    );
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (phone.trim().length < 6) return toast.error("Please enter a valid phone number");
    if (address.trim().length < 5) return toast.error("Please enter your full address");
    if (problem.trim().length < 20)
      return toast.error("Describe the problem in at least 20 characters");

    setSubmitting(true);
    try {
      const response = await apiSend<Booking>("/api/bookings", {
        serviceId,
        customerPhone: phone.trim(),
        address: address.trim(),
        preferredDate,
        problemDescription: problem.trim(),
      });
      setCreatedId(response.data.id);
      toast.success("Repair request sent successfully");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not send the request");
    } finally {
      setSubmitting(false);
    }
  }

  function close() {
    setOpen(false);
    setCreatedId(null);
    setProblem("");
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-primary w-full py-3">
        <Wrench className="size-4" /> Request this repair
      </button>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-ink-500">
        <Lock className="size-3.5" /> No payment now — pay after completion
      </p>

      {open && (
        <div className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <div
            className="fixed inset-0 bg-ink-950/50 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-title"
            className="relative my-8 w-full max-w-lg rounded-2xl border border-ink-200 bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-700"
              aria-label="Close request form"
            >
              <X className="size-4" />
            </button>

            {createdId ? (
              <div className="py-4 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="size-7" />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-ink-900">Request sent!</h2>
                <p className="mt-2 text-sm text-ink-500">
                  {technicianName} has been notified about “{serviceTitle}”. You can track the job
                  status from My Bookings.
                </p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Link
                    href="/dashboard/customer/bookings"
                    className="btn-primary"
                    onClick={close}
                  >
                    Go to My Bookings
                  </Link>
                  <button type="button" className="btn-outline" onClick={close}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 id="request-title" className="pr-8 text-lg font-semibold text-ink-900">
                  Request a repair
                </h2>
                <p className="mt-1 text-sm text-ink-500">
                  {serviceTitle} · {technicianName}
                </p>

                <form onSubmit={submit} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="req-name">
                        Your name
                      </label>
                      <input id="req-name" value={user.name} readOnly className="input bg-ink-50" />
                    </div>
                    <div>
                      <label className="label" htmlFor="req-email">
                        Email
                      </label>
                      <input
                        id="req-email"
                        value={user.email}
                        readOnly
                        className="input bg-ink-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="req-phone">
                      Phone number
                    </label>
                    <input
                      id="req-phone"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="req-address">
                      Service address
                    </label>
                    <input
                      id="req-address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="House, road, area, city"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="req-date">
                      Preferred date
                    </label>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-400" />
                      <input
                        id="req-date"
                        type="date"
                        min={todayInputValue()}
                        value={preferredDate}
                        onChange={(event) => setPreferredDate(event.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="req-problem">
                      Problem description
                    </label>
                    <textarea
                      id="req-problem"
                      value={problem}
                      onChange={(event) => setProblem(event.target.value)}
                      rows={4}
                      placeholder="What is wrong with the device? Mention symptoms, model and anything the technician should know."
                      className="input resize-none"
                      required
                    />
                    <p className="mt-1 text-xs text-ink-400">
                      {problem.trim().length}/20 characters minimum
                    </p>
                  </div>

                  <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
                    {submitting ? "Sending request…" : "Send repair request"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
