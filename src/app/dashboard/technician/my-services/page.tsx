"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, PlusCircle, Trash2, Wrench, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { ApprovalBadge } from "@/components/ui/badges";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loaders";
import { ServiceForm } from "@/components/services/service-form";
import { ApiError, apiDelete, apiSend } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { formatMoney } from "@/lib/format";
import type { Service } from "@/lib/types";

export default function MyServicesPage() {
  const { data, loading, error, reload } = useApi<Service[]>("/api/services/technician/my");
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function toggleAvailability(service: Service) {
    setTogglingId(service.id);
    try {
      await apiSend(
        `/api/services/${service.id}/availability`,
        { isAvailable: !service.isAvailable },
        "PATCH"
      );
      toast.success(service.isAvailable ? "Service hidden from public" : "Service is live again");
      await reload();
    } catch (requestError) {
      toast.error(
        requestError instanceof ApiError ? requestError.message : "Could not update availability"
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function removeService() {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await apiDelete(`/api/services/${deleteTarget.id}`);
      toast.success("Service deleted");
      setDeleteTarget(null);
      await reload();
    } catch (requestError) {
      toast.error(
        requestError instanceof ApiError ? requestError.message : "Could not delete the service"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="My services"
        description="Update, hide or delete the repair services you offer."
        action={
          <Link href="/dashboard/technician/add-service" className="btn-primary">
            <PlusCircle className="size-4" /> Add service
          </Link>
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
          icon={Wrench}
          title="No services listed yet"
          description="Add your first repair service. It will be visible to customers after admin approval."
          action={{ href: "/dashboard/technician/add-service", label: "Add a service" }}
        />
      ) : (
        <div className="dash-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px]">
              <thead className="border-b border-ink-200 bg-ink-50/80">
                <tr>
                  <th className="table-th">Service</th>
                  <th className="table-th">Category</th>
                  <th className="table-th">Price</th>
                  <th className="table-th">Approval</th>
                  <th className="table-th">Available</th>
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
                          <p className="max-w-52 truncate font-semibold text-ink-900">
                            {service.title}
                          </p>
                          <p className="text-xs text-ink-500">{service.serviceMode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">{service.category}</td>
                    <td className="table-td font-semibold text-ink-900">
                      {formatMoney(service.basePrice)}
                    </td>
                    <td className="table-td">
                      <ApprovalBadge status={service.approvalStatus} />
                    </td>
                    <td className="table-td">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(service)}
                        disabled={togglingId === service.id}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          service.isAvailable ? "bg-emerald-500" : "bg-ink-300"
                        }`}
                        aria-label={service.isAvailable ? "Disable service" : "Enable service"}
                        aria-pressed={service.isAvailable}
                      >
                        <span
                          className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${
                            service.isAvailable ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="table-td">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditing(service)}
                          className="grid size-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                          aria-label="Edit service"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(service)}
                          className="grid size-8 place-items-center rounded-lg text-red-500 hover:bg-red-50"
                          aria-label="Delete service"
                        >
                          <Trash2 className="size-4" />
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

      {editing && (
        <div className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <div
            className="fixed inset-0 bg-ink-950/50 backdrop-blur-sm"
            onClick={() => setEditing(null)}
            aria-hidden="true"
          />
          <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-ink-200 bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-ink-400 hover:bg-ink-100"
              aria-label="Close edit form"
            >
              <X className="size-4" />
            </button>
            <h2 className="mb-1 text-lg font-semibold text-ink-900">Edit service</h2>
            <p className="mb-5 text-xs text-ink-500">
              Saving changes sends this service back to pending for admin review.
            </p>
            <ServiceForm
              initial={editing}
              onSaved={async () => {
                setEditing(null);
                await reload();
              }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this service?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” will be permanently removed. Existing bookings keep their copied details.`
            : undefined
        }
        confirmLabel="Delete service"
        busy={busy}
        onConfirm={removeService}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
