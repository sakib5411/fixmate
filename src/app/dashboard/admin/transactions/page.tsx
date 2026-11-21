"use client";

import { ReceiptText, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loaders";
import { useApi } from "@/lib/use-api";
import { formatDateTime, formatMoney, shortId } from "@/lib/format";
import type { Payment } from "@/lib/types";

export default function AdminTransactionsPage() {
  const { data, meta, loading, error } = useApi<Payment[], { total: number; revenue: number }>(
    "/api/admin/payments"
  );

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Every Stripe payment collected on FixMate."
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div className="dash-card flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <Wallet className="size-6" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
              Total revenue
            </p>
            <p className="text-2xl font-semibold text-ink-900">
              {formatMoney(meta?.revenue ?? 0)}
            </p>
          </div>
        </div>
        <div className="dash-card flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-xl bg-sky-50 text-sky-600">
            <ReceiptText className="size-6" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
              Transactions
            </p>
            <p className="text-2xl font-semibold text-ink-900">{meta?.total ?? data?.length ?? 0}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={ReceiptText}
          title="No transactions yet"
          description="Payments show up here as soon as customers pay for completed repairs."
        />
      ) : (
        <div className="dash-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-ink-200 bg-ink-50/80">
                <tr>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Technician</th>
                  <th className="table-th">Service</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Transaction ID</th>
                  <th className="table-th">Paid at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.map((payment) => (
                  <tr key={payment.id} className="hover:bg-ink-50/60">
                    <td className="table-td">
                      <p className="font-medium text-ink-800">{payment.customerName}</p>
                      <p className="text-xs text-ink-500">{payment.customerEmail}</p>
                    </td>
                    <td className="table-td">
                      <p className="font-medium text-ink-800">{payment.technicianName}</p>
                      <p className="text-xs text-ink-500">{payment.technicianEmail}</p>
                    </td>
                    <td className="table-td font-semibold text-ink-900">{payment.serviceTitle}</td>
                    <td className="table-td font-semibold text-emerald-600">
                      {formatMoney(payment.amount, payment.currency)}
                    </td>
                    <td className="table-td font-mono text-xs text-ink-500">
                      {shortId(payment.transactionId)}
                    </td>
                    <td className="table-td text-xs">{formatDateTime(payment.paidAt)}</td>
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
