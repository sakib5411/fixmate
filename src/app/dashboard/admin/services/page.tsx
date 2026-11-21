"use client";

import { useState } from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { ApprovalBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loaders";
import { ApiError, apiSend } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { formatDate, formatMoney } from "@/lib/format";
import type { Service } from "@/lib/types";

const FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "", label: "All" },
];

export default function AdminServicesPage() {
  const [filter, setFilter] = useState("pending");
  const path = `/api/admin/services${filter ? `?approvalStatus=${filter}` : ""}`;
  const { data, loading, error, reload } = useApi<Service[]>(path);
  const [workingId, setWorkingId] = useState<string | null>(null);

  async function setApproval(service: Service, approvalStatus: "approved" | "rejected") {
    setWorkingId(service.id);
    try {
      await apiSend(`/api/admin/services/${service.id}/approval`, { approvalStatus }, "PATCH");
      toast.success(approvalStatus === "approved" ? "Service approved" : "Service rejected");
      await reload();
    } catch (requestError) {
      toast.error(
        requestError instanceof ApiError ? requestError.message : "Could not update the service"
      );
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Service approval"
        description="Review technician listings before they appear on public pages."
        action={
          <div className="flex gap-1 rounded-full border border-ink-200 bg-white p-1">
            {FILTERS.map((option) => (
              <button
                key={option.value || "all"}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === option.value ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={ShieldCheck}
          title="Nothing to review here"
          description="New technician listings will appear in the pending queue."
        />
      ) : (
        <div className="dash-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px]">
              <thead className="border-b border-ink-200 bg-ink-50/80">
                <tr>
                  <th className="table-th">Service</th>
                  <th className="table-th">Technician</th>
                  <th className="table-th">Category</th>
                  <th className="table-th">Price</th>
                  <th className="table-th">Submitted</th>
                  <th className="table-th">Status</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.map((service) => (
                  <tr key={service.id} className="hover:bg-ink-50/60">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={service.image}
                          alt={service.title}
                          className="size-10 rounded-lg border border-ink-200 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="max-w-56 truncate font-semibold text-ink-900">
                            {service.title}
                          </p>
                          <p className="text-xs text-ink-500">{service.serviceMode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <p className="font-medium text-ink-800">{service.technicianName}</p>
                      <p className="text-xs text-ink-500">{service.serviceArea}</p>
                    </td>
                    <td className="table-td">{service.category}</td>
                    <td className="table-td font-semibold text-ink-900">
                      {formatMoney(service.basePrice)}
                    </td>
                    <td className="table-td text-xs text-ink-500">
                      {formatDate(service.createdAt)}
                    </td>
                    <td className="table-td">
                      <ApprovalBadge status={service.approvalStatus} />
                    </td>
                    <td className="table-td">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setApproval(service, "approved")}
                          disabled={workingId === service.id || service.approvalStatus === "approved"}
                          className="btn-primary btn-sm"
                        >
                          <Check className="size-3.5" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setApproval(service, "rejected")}
                          disabled={workingId === service.id || service.approvalStatus === "rejected"}
                          className="btn-outline btn-sm text-red-600 hover:bg-red-50"
                        >
                          <X className="size-3.5" /> Reject
                        </button>
                      </div>
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
