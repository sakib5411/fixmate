"use client";

import { useState } from "react";
import { Check, Inbox, Play, X as XIcon, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { PaymentBadge, StatusBadge } from "@/components/ui/badges";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loaders";
import { ApiError, apiSend } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { formatDate, formatMoney } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";

const FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function TechnicianRequestsPage() {
  const [filter, setFilter] = useState("");
  const path = `/api/bookings/technician${filter ? `?status=${filter}` : ""}`;
  const { data, loading, error, reload } = useApi<Booking[]>(path);

  const [workingId, setWorkingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Booking | null>(null);
  const [completeTarget, setCompleteTarget] = useState<Booking | null>(null);
  const [finalAmount, setFinalAmount] = useState("");
  const [busy, setBusy] = useState(false);

  async function changeStatus(
    booking: Booking,
    status: BookingStatus,
    amount?: number
  ) {
    setWorkingId(booking.id);
    try {
      await apiSend(
        `/api/bookings/${booking.id}/status`,
        amount === undefined ? { status } : { status, finalAmount: amount },
        "PATCH"
      );
      toast.success(
        status === "accepted"
          ? "Request accepted"
          : status === "rejected"
            ? "Request rejected"
            : status === "in-progress"
              ? "Job started"
              : "Job marked completed"
      );
      setRejectTarget(null);
      setCompleteTarget(null);
      await reload();
    } catch (requestError) {
      toast.error(
        requestError instanceof ApiError ? requestError.message : "Could not update the job"
      );
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Manage requests"
        description="Move each repair through the job pipeline and set the final amount on completion."
        action={
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="input w-auto rounded-full py-2.5"
            aria-label="Filter requests by status"
          >
            {FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        }
      />

      {loading ? (
        <TableSkeleton rows={4} />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={Inbox}
          title="No requests in this view"
          description="When a customer books one of your services, the request appears here."
        />
      ) : (
        <div className="grid gap-4">
          {data.map((booking) => (
            <article key={booking.id} className="dash-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-ink-900">{booking.serviceTitle}</h2>
                    <StatusBadge status={booking.status} />
                    {booking.status === "completed" && (
                      <PaymentBadge status={booking.paymentStatus} />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    Booking #{booking.id.slice(-6).toUpperCase()} ·{" "}
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
                <p className="text-lg font-semibold text-ink-900">
                  {formatMoney(booking.finalAmount)}
                </p>
              </div>

              <div className="mt-3 grid gap-2 text-xs text-ink-600 sm:grid-cols-2 lg:grid-cols-4">
                <p>
                  <span className="text-ink-400">Customer</span>
                  <br />
                  <span className="font-medium text-ink-800">{booking.customerName}</span>
                </p>
                <p>
                  <span className="text-ink-400">Phone</span>
                  <br />
                  <span className="font-medium text-ink-800">{booking.customerPhone}</span>
                </p>
                <p>
                  <span className="text-ink-400">Preferred date</span>
                  <br />
                  <span className="font-medium text-ink-800">
                    {formatDate(booking.preferredDate)}
                  </span>
                </p>
                <p>
                  <span className="text-ink-400">Base price</span>
                  <br />
                  <span className="font-medium text-ink-800">{formatMoney(booking.basePrice)}</span>
                </p>
              </div>

              <p className="mt-3 text-xs text-ink-600">
                <span className="text-ink-400">Address: </span>
                {booking.address}
              </p>
              <p className="mt-2 rounded-xl bg-ink-50 px-3 py-2 text-xs leading-relaxed text-ink-600">
                {booking.problemDescription}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {booking.status === "requested" && (
                  <>
                    <button
                      type="button"
                      onClick={() => changeStatus(booking, "accepted")}
                      disabled={workingId === booking.id}
                      className="btn-primary btn-sm"
                    >
                      <Check className="size-3.5" /> Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectTarget(booking)}
                      className="btn-outline btn-sm text-red-600 hover:bg-red-50"
                    >
                      <XIcon className="size-3.5" /> Reject
                    </button>
                  </>
                )}

                {booking.status === "accepted" && (
                  <button
                    type="button"
                    onClick={() => changeStatus(booking, "in-progress")}
                    disabled={workingId === booking.id}
                    className="btn-primary btn-sm"
                  >
                    <Play className="size-3.5" /> Start work
                  </button>
                )}

                {booking.status === "in-progress" && (
                  <button
                    type="button"
                    onClick={() => {
                      setCompleteTarget(booking);
                      setFinalAmount(String(booking.finalAmount || booking.basePrice));
                    }}
                    className="btn-primary btn-sm"
                  >
                    <Check className="size-3.5" /> Mark completed
                  </button>
                )}

                {["completed", "rejected", "cancelled"].includes(booking.status) && (
                  <p className="text-xs text-ink-500">
                    No action available — this job is {booking.status}.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(rejectTarget)}
        title="Reject this repair request?"
        description={
          rejectTarget
            ? `“${rejectTarget.serviceTitle}” from ${rejectTarget.customerName} will be rejected. This is a final state.`
            : undefined
        }
        confirmLabel="Reject request"
        busy={busy}
        onConfirm={async () => {
          if (!rejectTarget) return;
          setBusy(true);
          await changeStatus(rejectTarget, "rejected");
          setBusy(false);
        }}
        onClose={() => setRejectTarget(null)}
      />

      {completeTarget && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
            onClick={() => setCompleteTarget(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-ink-200 bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setCompleteTarget(null)}
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-ink-400 hover:bg-ink-100"
              aria-label="Close"
            >
              <XCircle className="size-4" />
            </button>
            <h2 className="text-lg font-semibold text-ink-900">Complete this job</h2>
            <p className="mt-1 text-sm text-ink-500">
              Enter the final amount the customer will pay for “{completeTarget.serviceTitle}”.
            </p>

            <label className="label mt-5" htmlFor="final-amount">
              Final amount (USD)
            </label>
            <input
              id="final-amount"
              type="number"
              min="1"
              step="1"
              value={finalAmount}
              onChange={(event) => setFinalAmount(event.target.value)}
              className="input"
            />

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="btn-outline" onClick={() => setCompleteTarget(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={workingId === completeTarget.id || !(Number(finalAmount) > 0)}
                onClick={() => changeStatus(completeTarget, "completed", Number(finalAmount))}
              >
                {workingId === completeTarget.id ? "Saving…" : "Mark completed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
