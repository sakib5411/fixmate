"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CreditCard,
  MapPin,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { PaymentBadge, StatusBadge } from "@/components/ui/badges";
import { BookingTimeline } from "@/components/booking/timeline";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/loaders";
import { ApiError, apiSend } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { formatDate, formatMoney } from "@/lib/format";
import type { Booking } from "@/lib/types";

export default function CustomerBookingsPage() {
  const { data, loading, error, reload } = useApi<Booking[]>("/api/bookings/my");
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  async function cancelBooking() {
    if (!cancelTarget) return;
    setBusy(true);
    try {
      await apiSend(`/api/bookings/${cancelTarget.id}/cancel`, {}, "PATCH");
      toast.success("Request cancelled");
      setCancelTarget(null);
      await reload();
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Could not cancel");
    } finally {
      setBusy(false);
    }
  }

  async function payNow(booking: Booking) {
    setPayingId(booking.id);
    try {
      const response = await apiSend<{ url: string }>("/api/payments/create-checkout-session", {
        bookingId: booking.id,
      });
      window.location.href = response.data.url;
    } catch (requestError) {
      toast.error(
        requestError instanceof ApiError ? requestError.message : "Could not start checkout"
      );
      setPayingId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="My bookings"
        description="Track every repair request, cancel while it is still requested, and pay once it is completed."
        action={
          <Link href="/services" className="btn-outline">
            New request
          </Link>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-7 text-brand-500" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : !data?.length ? (
        <EmptyState
          title="No repair requests yet"
          description="Browse approved services and send your first repair request — you only pay after the job is done."
          action={{ href: "/services", label: "Browse services" }}
        />
      ) : (
        <div className="grid gap-4">
          {data.map((booking) => {
            const canCancel = booking.status === "requested";
            const canPay = booking.status === "completed" && booking.paymentStatus === "unpaid";

            return (
              <article key={booking.id} className="dash-card">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={booking.serviceImage}
                    alt={booking.serviceTitle}
                    className="h-28 w-full rounded-xl border border-ink-200 object-cover sm:w-40"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-semibold text-ink-900">
                            {booking.serviceTitle}
                          </h2>
                          <StatusBadge status={booking.status} />
                          <PaymentBadge status={booking.paymentStatus} />
                        </div>
                        <p className="mt-1 text-xs text-ink-500">
                          {booking.category} · Booking #{booking.id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-ink-500">Amount</p>
                        <p className="text-lg font-semibold text-ink-900">
                          {formatMoney(booking.finalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 text-xs text-ink-600 sm:grid-cols-2">
                      <p className="flex items-center gap-1.5">
                        <UserRound className="size-3.5 text-ink-400" /> {booking.technicianName}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-ink-400" />{" "}
                        {formatDate(booking.preferredDate)}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="size-3.5 text-ink-400" /> {booking.customerPhone}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-ink-400" /> {booking.address}
                      </p>
                    </div>

                    <p className="mt-3 rounded-xl bg-ink-50 px-3 py-2 text-xs leading-relaxed text-ink-600">
                      {booking.problemDescription}
                    </p>

                    <BookingTimeline booking={booking} />

                    {(canCancel || canPay) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {canPay && (
                          <button
                            type="button"
                            onClick={() => payNow(booking)}
                            disabled={payingId === booking.id}
                            className="btn-primary btn-sm"
                          >
                            <CreditCard className="size-3.5" />
                            {payingId === booking.id ? "Opening checkout…" : "Pay Now"}
                          </button>
                        )}
                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(booking)}
                            className="btn-outline btn-sm text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="size-3.5" /> Cancel request
                          </button>
                        )}
                      </div>
                    )}

                    {booking.status === "completed" && booking.paymentStatus === "paid" && (
                      <p className="mt-4 text-xs font-medium text-emerald-600">
                        Paid on {formatDate(booking.updatedAt)} — this job is closed.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancel this repair request?"
        description={
          cancelTarget
            ? `“${cancelTarget.serviceTitle}” will be cancelled and ${cancelTarget.technicianName} will be notified. This cannot be undone.`
            : undefined
        }
        confirmLabel="Yes, cancel request"
        busy={busy}
        onConfirm={cancelBooking}
        onClose={() => setCancelTarget(null)}
      />
    </>
  );
}
