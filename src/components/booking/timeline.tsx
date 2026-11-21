import { Check } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { Booking, StatusHistoryEntry } from "@/lib/types";

const STEPS = ["requested", "accepted", "in-progress", "completed"] as const;

const LABELS: Record<string, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export function BookingTimeline({ booking }: { booking: Booking }) {
  const history: StatusHistoryEntry[] = booking.statusHistory ?? [];
  const closed = booking.status === "rejected" || booking.status === "cancelled";

  const reached = (status: string) => history.some((entry) => entry.status === status);
  const changedAt = (status: string) =>
    history.find((entry) => entry.status === status)?.changedAt;

  if (closed) {
    return (
      <div className="mt-4 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-xs text-ink-600">
        This job was <span className="font-semibold">{LABELS[booking.status]}</span>
        {changedAt(booking.status) ? ` on ${formatDateTime(changedAt(booking.status)!)}` : ""}.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {STEPS.map((status, index) => {
          const done = reached(status);
          return (
            <li key={status} className="flex items-center gap-2">
              <span
                className={`grid size-6 place-items-center rounded-full text-[10px] font-semibold ${
                  done ? "bg-emerald-500 text-white" : "bg-ink-100 text-ink-400"
                }`}
              >
                {done ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={`text-[11px] font-medium ${
                  done ? "text-ink-900" : "text-ink-400"
                }`}
              >
                {LABELS[status]}
              </span>
              {index < STEPS.length - 1 && (
                <span
                  className={`hidden h-px w-6 sm:block ${
                    reached(STEPS[index + 1]) ? "bg-emerald-400" : "bg-ink-200"
                  }`}
                />
              )}
            </li>
          );
        })}
        <li className="flex items-center gap-2">
          <span
            className={`grid size-6 place-items-center rounded-full text-[10px] font-semibold ${
              booking.paymentStatus === "paid"
                ? "bg-emerald-500 text-white"
                : "bg-ink-100 text-ink-400"
            }`}
          >
            {booking.paymentStatus === "paid" ? <Check className="size-3.5" /> : 5}
          </span>
          <span
            className={`text-[11px] font-medium ${
              booking.paymentStatus === "paid" ? "text-ink-900" : "text-ink-400"
            }`}
          >
            Paid
          </span>
        </li>
      </ol>
    </div>
  );
}
