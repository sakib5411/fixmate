"use client";

import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceForm } from "@/components/services/service-form";
import { useAuth } from "@/components/providers/auth-provider";

export default function AddServicePage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title="Add a service"
        description="New services stay pending until an admin approves them."
      />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="dash-card">
          <div className="mb-5 grid gap-3 rounded-xl bg-ink-50 p-4 text-xs text-ink-600 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-ink-900">Technician</span>
              <br />
              {user?.name ?? "—"}
            </p>
            <p>
              <span className="font-semibold text-ink-900">Email</span>
              <br />
              {user?.email ?? "—"}
            </p>
          </div>

          <ServiceForm
            onSaved={() => router.push("/dashboard/technician/my-services")}
          />
        </div>

        <aside className="rounded-2xl border border-brand-200 bg-brand-50/70 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-800">
            <Info className="size-4" /> Approval workflow
          </p>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-brand-900/80">
            <li>• Every new service is created with status “pending”.</li>
            <li>• An admin reviews and approves or rejects the listing.</li>
            <li>• Only approved, available services appear on public pages.</li>
            <li>• Editing a service later sends it back for approval.</li>
          </ul>
        </aside>
      </div>
    </>
  );
}
