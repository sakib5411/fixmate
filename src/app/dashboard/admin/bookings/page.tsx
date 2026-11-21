"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { PaymentBadge, StatusBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loaders";
import { useApi } from "@/lib/use-api";
import { formatDate, formatMoney } from "@/lib/format";
import type { Booking } from "@/lib/types";

const FILTERS = [
  { value: "", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState("");
  const path = `/api/admin/bookings${filter ? `?status=${filter}` : ""}`;
  const { data, loading, error } = useApi<Booking[]>(path);

  return (
    <>
      <PageHeader
        title="All bookings"
        description="Every repair job on the platform, read-only."
        action={
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="input w-auto rounded-full py-2.5"
            aria-label="Filter bookings by status"
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
        <TableSkeleton rows={6} />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={CalendarDays}
          title="No bookings in this view"
          description="Choose another status filter to see other repair jobs."
        />
      ) : (
        <div className="dash-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-ink-200 bg-ink-50/80">
                <tr>
                  <th className="table-th">Service</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Technician</th>
                  <th className="table-th">Preferred date</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Payment</th>
                  <th className="table-th text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.map((booking) => (
                  <tr key={booking.id} className="hover:bg-ink-50/60">
                    <td className="table-td">
                      <p className="font-semibold text-ink-900">{booking.serviceTitle}</p>
                      <p className="text-xs text-ink-500">{booking.category}</p>
                    </td>
                    <td className="table-td">
                      <p className="font-medium text-ink-800">{booking.customerName}</p>
                      <p className="text-xs text-ink-500">{booking.customerEmail}</p>
                    </td>
                    <td className="table-td">
                      <p className="font-medium text-ink-800">{booking.technicianName}</p>
                      <p className="text-xs text-ink-500">{booking.technicianEmail}</p>
                    </td>
                    <td className="table-td text-xs">{formatDate(booking.preferredDate)}</td>
                    <td className="table-td">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="table-td">
                      <PaymentBadge status={booking.paymentStatus} />
                    </td>
                    <td className="table-td text-right font-semibold text-ink-900">
                      {formatMoney(booking.finalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
