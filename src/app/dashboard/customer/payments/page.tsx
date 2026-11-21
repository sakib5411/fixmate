"use client";

import { ReceiptText } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loaders";
import { useApi } from "@/lib/use-api";
import { formatDateTime, formatMoney, shortId } from "@/lib/format";
import type { Payment } from "@/lib/types";

export default function CustomerPaymentsPage() {
  const { data, loading, error } = useApi<Payment[], { total: number }>("/api/payments/my");

  return (
    <>
      <PageHeader
        title="Payment history"
        description="Every repair you have paid for, with its Stripe transaction reference."
      />

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={ReceiptText}
          title="No payments yet"
          description="Payments appear here after you pay for a completed repair."
        />
      ) : (
        <div className="dash-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="border-b border-ink-200 bg-ink-50/80">
                <tr>
                  <th className="table-th">Service</th>
                  <th className="table-th">Technician</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Transaction ID</th>
                  <th className="table-th">Paid at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.map((payment) => (
                  <tr key={payment.id} className="hover:bg-ink-50/60">
                    <td className="table-td font-semibold text-ink-900">{payment.serviceTitle}</td>
                    <td className="table-td">{payment.technicianName}</td>
                    <td className="table-td font-semibold text-emerald-600">
                      {formatMoney(payment.amount, payment.currency)}
                    </td>
                    <td className="table-td font-mono text-xs text-ink-500">
                      {shortId(payment.transactionId)}
                    </td>
                    <td className="table-td">{formatDateTime(payment.paidAt)}</td>
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
