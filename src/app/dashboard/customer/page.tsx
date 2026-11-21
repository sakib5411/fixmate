"use client";

import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2, ClipboardList, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badges";
import { BarChart, StatusBreakdown } from "@/components/ui/charts";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/loaders";
import { useApi } from "@/lib/use-api";
import { formatDate, formatMoney } from "@/lib/format";
import type { Booking, CustomerStats } from "@/lib/types";

export default function CustomerOverviewPage() {
  const stats = useApi<CustomerStats>("/api/dashboard/customer");
  const bookings = useApi<Booking[]>("/api/bookings/my");

  if (stats.loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="size-7 text-brand-500" />
      </div>
    );
  }

  const data = stats.data;

  return (
    <>
      <PageHeader
        title="Customer overview"
        description="A quick look at your repair requests, active jobs and spending."
        action={
          <Link href="/services" className="btn-primary">
            Book a repair
          </Link>
        }
      />

      {stats.error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {stats.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Requests" value={data?.totalRequests ?? 0} icon={ClipboardList} />
        <StatCard label="Active Jobs" value={data?.activeJobs ?? 0} icon={Activity} tone="sky" />
        <StatCard
          label="Completed Jobs"
          value={data?.completedJobs ?? 0}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Total Spent"
          value={formatMoney(data?.totalSpent ?? 0)}
          icon={Wallet}
          tone="violet"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="dash-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-ink-900">Requests per month</h2>
              <p className="text-xs text-ink-500">Last 6 months of repair activity</p>
            </div>
          </div>
          <div className="mt-5">
            <BarChart data={data?.monthlyBookings ?? []} />
          </div>
        </div>

        <div className="dash-card">
          <h2 className="text-sm font-semibold text-ink-900">Job status breakdown</h2>
          <p className="text-xs text-ink-500">Where your requests currently stand</p>
          <div className="mt-5">
            <StatusBreakdown breakdown={data?.statusBreakdown ?? {}} />
          </div>
        </div>
      </div>

      <div className="dash-card mt-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink-900">Recent bookings</h2>
            <p className="text-xs text-ink-500">Your latest repair requests</p>
          </div>
          <Link
            href="/dashboard/customer/bookings"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            View all →
          </Link>
        </div>

        <div className="mt-4">
          {bookings.loading ? (
            <div className="flex justify-center py-8">
              <Spinner className="text-brand-500" />
            </div>
          ) : bookings.data?.length ? (
            <ul className="divide-y divide-ink-100">
              {bookings.data.slice(0, 4).map((booking) => (
                <li key={booking.id} className="flex flex-wrap items-center gap-3 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={booking.serviceImage}
                    alt={booking.serviceTitle}
                    className="size-11 rounded-lg border border-ink-200 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {booking.serviceTitle}
                    </p>
                    <p className="text-xs text-ink-500">
                      {booking.technicianName} · {formatDate(booking.preferredDate)}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                  <span className="text-sm font-semibold text-ink-900">
                    {formatMoney(booking.finalAmount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No bookings yet"
              description="When you request a repair, it will show up here with a live status."
              action={{ href: "/services", label: "Browse services" }}
            />
          )}
        </div>

        {bookings.data?.length ? (
          <Link
            href="/dashboard/customer/bookings"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-ink-600 hover:text-ink-900"
          >
            Manage all bookings <ArrowRight className="size-3.5" />
          </Link>
        ) : null}
      </div>
    </>
  );
}
