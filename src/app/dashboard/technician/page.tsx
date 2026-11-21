"use client";

import Link from "next/link";
import { BadgeCheck, Clock, Inbox, PlusCircle, Wallet, Wrench } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { BarChart, StatusBreakdown } from "@/components/ui/charts";
import { Spinner } from "@/components/ui/loaders";
import { useApi } from "@/lib/use-api";
import { formatMoney } from "@/lib/format";
import type { TechnicianStats } from "@/lib/types";

export default function TechnicianOverviewPage() {
  const { data, loading, error } = useApi<TechnicianStats>("/api/dashboard/technician");

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
        title="Technician overview"
        description="Your listings, incoming requests and earnings at a glance."
        action={
          <Link href="/dashboard/technician/add-service" className="btn-primary">
            <PlusCircle className="size-4" /> Add service
          </Link>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Services" value={data?.totalServices ?? 0} icon={Wrench} />
        <StatCard
          label="Approved Services"
          value={data?.approvedServices ?? 0}
          icon={BadgeCheck}
          tone="emerald"
        />
        <StatCard
          label="Pending Requests"
          value={data?.pendingRequests ?? 0}
          icon={Inbox}
          tone="sky"
        />
        <StatCard
          label="Total Earnings"
          value={formatMoney(data?.totalEarnings ?? 0)}
          icon={Wallet}
          tone="violet"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="dash-card">
          <h2 className="text-sm font-semibold text-ink-900">Earnings per month</h2>
          <p className="text-xs text-ink-500">Paid repairs over the last 6 months</p>
          <div className="mt-5">
            <BarChart
              data={data?.monthlyEarnings ?? []}
              accent="bg-emerald-500"
              format={(value) => `$${Math.round(value)}`}
            />
          </div>
        </div>

        <div className="dash-card">
          <h2 className="text-sm font-semibold text-ink-900">Job status breakdown</h2>
          <p className="text-xs text-ink-500">All requests assigned to you</p>
          <div className="mt-5">
            <StatusBreakdown breakdown={data?.statusBreakdown ?? {}} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/technician/requests" className="dash-card group">
          <Inbox className="size-5 text-brand-500" />
          <p className="mt-3 text-sm font-semibold text-ink-900">Manage requests</p>
          <p className="mt-1 text-xs text-ink-500">
            {data?.pendingRequests ?? 0} request(s) waiting for your response.
          </p>
        </Link>
        <Link href="/dashboard/technician/my-services" className="dash-card group">
          <Clock className="size-5 text-sky-500" />
          <p className="mt-3 text-sm font-semibold text-ink-900">Pending services</p>
          <p className="mt-1 text-xs text-ink-500">
            {data?.pendingServices ?? 0} listing(s) awaiting admin approval.
          </p>
        </Link>
        <Link href="/dashboard/technician/my-services" className="dash-card group">
          <BadgeCheck className="size-5 text-emerald-500" />
          <p className="mt-3 text-sm font-semibold text-ink-900">Completed jobs</p>
          <p className="mt-1 text-xs text-ink-500">
            {data?.completedJobs ?? 0} repair(s) delivered so far.
          </p>
        </Link>
      </div>
    </>
  );
}
