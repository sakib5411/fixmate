"use client";

import Link from "next/link";
import {
  CalendarDays,
  ReceiptText,
  ShieldCheck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { BarChart, StatusBreakdown } from "@/components/ui/charts";
import { Spinner } from "@/components/ui/loaders";
import { useApi } from "@/lib/use-api";
import { formatMoney } from "@/lib/format";
import type { AdminStats } from "@/lib/types";

export default function AdminOverviewPage() {
  const { data, loading, error } = useApi<AdminStats>("/api/dashboard/admin");

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="size-7 text-brand-500" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Platform overview"
        description="Users, listings, repair jobs and Stripe revenue in one place."
      />

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={data?.totalUsers ?? 0} icon={Users} />
        <StatCard
          label="Total Technicians"
          value={data?.totalTechnicians ?? 0}
          icon={Wrench}
          tone="sky"
        />
        <StatCard
          label="Pending Services"
          value={data?.pendingServices ?? 0}
          icon={ShieldCheck}
          tone="violet"
        />
        <StatCard
          label="Total Revenue"
          value={formatMoney(data?.totalRevenue ?? 0)}
          icon={Wallet}
          tone="emerald"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="dash-card">
          <h2 className="text-sm font-semibold text-ink-900">Revenue per month</h2>
          <p className="text-xs text-ink-500">Successful Stripe payments, last 6 months</p>
          <div className="mt-5">
            <BarChart
              data={data?.monthlyRevenue ?? []}
              accent="bg-emerald-500"
              format={(value) => `$${Math.round(value)}`}
            />
          </div>
        </div>

        <div className="dash-card">
          <h2 className="text-sm font-semibold text-ink-900">All jobs by status</h2>
          <p className="text-xs text-ink-500">Across every technician</p>
          <div className="mt-5">
            <StatusBreakdown breakdown={data?.statusBreakdown ?? {}} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="dash-card">
          <h2 className="text-sm font-semibold text-ink-900">Bookings per month</h2>
          <p className="text-xs text-ink-500">New repair requests on the platform</p>
          <div className="mt-5">
            <BarChart data={data?.monthlyBookings ?? []} accent="bg-sky-500" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Link href="/dashboard/admin/services" className="dash-card">
            <ShieldCheck className="size-5 text-brand-500" />
            <p className="mt-3 text-sm font-semibold text-ink-900">Service approval</p>
            <p className="mt-1 text-xs text-ink-500">
              {data?.pendingServices ?? 0} listing(s) waiting for review ·{" "}
              {data?.approvedServices ?? 0} approved
            </p>
          </Link>
          <Link href="/dashboard/admin/bookings" className="dash-card">
            <CalendarDays className="size-5 text-sky-500" />
            <p className="mt-3 text-sm font-semibold text-ink-900">All bookings</p>
            <p className="mt-1 text-xs text-ink-500">
              {data?.totalBookings ?? 0} repair job(s) on the platform
            </p>
          </Link>
          <Link href="/dashboard/admin/transactions" className="dash-card">
            <ReceiptText className="size-5 text-emerald-500" />
            <p className="mt-3 text-sm font-semibold text-ink-900">Transactions</p>
            <p className="mt-1 text-xs text-ink-500">
              {formatMoney(data?.totalRevenue ?? 0)} collected through Stripe
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
