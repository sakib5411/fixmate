import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  Clock,
  MapPin,
  ShieldCheck,
  Tag,
  Truck,
  UserRound,
  Wallet,
} from "lucide-react";
import { RequestRepair } from "@/components/services/request-repair";
import { publicFetch } from "@/lib/public-api";
import { formatMoney, initials } from "@/lib/format";
import type { Service } from "@/lib/types";

export interface ServiceDetail extends Service {
  technician: {
    name: string;
    email: string;
    image: string | null;
    area: string | null;
    bio: string | null;
    phone: string | null;
  } | null;
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await publicFetch<ServiceDetail>(`/api/services/${id}`);

  if (!result?.data) {
    notFound();
  }

  const service = result.data;
  const technician = service.technician;

  return (
    <div className="container-page py-10 sm:py-14">
      <nav className="flex items-center gap-1.5 text-xs text-ink-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink-900">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/services" className="hover:text-ink-900">
          Services
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="truncate text-ink-700">{service.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <div>
          <div className="overflow-hidden rounded-3xl border border-ink-200 bg-ink-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.image}
              alt={service.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="badge bg-brand-50 text-brand-700 ring-1 ring-brand-200">
              <Tag className="size-3.5" /> {service.category}
            </span>
            <span className="badge bg-ink-100 text-ink-700">
              <Truck className="size-3.5" /> {service.serviceMode}
            </span>
            <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
              <BadgeCheck className="size-3.5" /> Approved listing
            </span>
          </div>

          <h1 className="h1 mt-4">{service.title}</h1>

          <p className="mt-4 text-sm leading-relaxed text-ink-600 sm:text-base">
            {service.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Starting price", value: formatMoney(service.basePrice), icon: Wallet },
              { label: "Estimated time", value: service.estimatedDuration, icon: Clock },
              { label: "Service area", value: service.serviceArea, icon: MapPin },
            ].map((item) => (
              <div key={item.label} className="card p-4">
                <span className="grid size-9 place-items-center rounded-lg bg-ink-100 text-ink-700">
                  <item.icon className="size-4" />
                </span>
                <p className="mt-3 text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink-900">{item.value}</p>
              </div>
            ))}
          </div>

          <section className="mt-8">
            <h2 className="h3">About the technician</h2>
            <div className="card mt-3 flex flex-col gap-4 p-5 sm:flex-row">
              {technician?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={technician.image}
                  alt={technician.name}
                  className="size-16 shrink-0 rounded-2xl border border-ink-200 object-cover"
                />
              ) : (
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-ink-900 text-lg font-semibold text-white">
                  {initials(service.technicianName)}
                </span>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-ink-900">{service.technicianName}</p>
                  <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                    <ShieldCheck className="size-3.5" /> Verified
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
                  <MapPin className="size-3.5" /> {technician?.area ?? service.serviceArea}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {technician?.bio ??
                    "Experienced FixMate technician offering reliable, on-time repair services."}
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="card p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
                  Starting price
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-ink-900">
                  {formatMoney(service.basePrice)}
                </p>
              </div>
              <span className="badge bg-ink-100 text-ink-700">
                <UserRound className="size-3.5" /> {service.technicianName.split(" ")[0]}
              </span>
            </div>

            <ul className="mt-5 space-y-2.5 border-t border-ink-100 pt-5 text-sm text-ink-600">
              {[
                `${service.serviceMode} support`,
                `Estimated ${service.estimatedDuration}`,
                "Final price confirmed before completion",
                "Secure Stripe checkout after the job",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <RequestRepair
                serviceId={service.id}
                serviceTitle={service.title}
                technicianName={service.technicianName}
              />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-ink-200 bg-ink-50 p-5">
            <p className="text-sm font-semibold text-ink-900">How payment works</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
              You never pay upfront. Once the technician finishes the repair and sets the final
              amount, a Pay Now button appears in your bookings.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
