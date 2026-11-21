import Link from "next/link";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceFilters } from "@/components/services/service-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { CardGridSkeleton } from "@/components/ui/loaders";
import { publicFetch } from "@/lib/public-api";
import type { PaginationMeta, Service } from "@/lib/types";

interface ServicesSearchParams {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
  page?: string;
}

function buildQuery(params: ServicesSearchParams): string {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.serviceMode) query.set("serviceMode", params.serviceMode);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", params.page);
  query.set("limit", "9");
  return query.toString();
}

async function ServiceResults({ params }: { params: ServicesSearchParams }) {
  const result = await publicFetch<Service[], PaginationMeta>(
    `/api/services?${buildQuery(params)}`
  );

  const services = result?.data ?? [];
  const meta = result?.meta;
  const page = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;

  function pageHref(target: number) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.serviceMode) query.set("serviceMode", params.serviceMode);
    if (params.sort) query.set("sort", params.sort);
    query.set("page", String(target));
    return `/services?${query.toString()}`;
  }

  return (
    <>
      <ServiceFilters total={meta?.total ?? services.length} />

      {services.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={SearchX}
            title="No services match your filters"
            description="Try a different keyword, category or service mode — or clear the filters to see everything."
            action={{ href: "/services", label: "Clear filters" }}
          />
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
          <Link
            href={pageHref(Math.max(1, page - 1))}
            aria-disabled={page === 1}
            className={`btn-outline btn-sm ${page === 1 ? "pointer-events-none opacity-40" : ""}`}
          >
            Previous
          </Link>
          {Array.from({ length: totalPages }).map((_, index) => {
            const target = index + 1;
            return (
              <Link
                key={target}
                href={pageHref(target)}
                className={
                  target === page
                    ? "grid size-9 place-items-center rounded-full bg-ink-900 text-xs font-semibold text-white"
                    : "grid size-9 place-items-center rounded-full border border-ink-200 text-xs font-semibold text-ink-600 hover:bg-ink-50"
                }
              >
                {target}
              </Link>
            );
          })}
          <Link
            href={pageHref(Math.min(totalPages, page + 1))}
            aria-disabled={page === totalPages}
            className={`btn-outline btn-sm ${
              page === totalPages ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Next
          </Link>
        </nav>
      )}
    </>
  );
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<ServicesSearchParams>;
}) {
  const params = await searchParams;

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand-600 uppercase">
          Browse services
        </p>
        <h1 className="h1 mt-2">Repair services near you</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">
          Every listing below comes from a verified technician and has been approved by our team.
          Compare price, service mode and area before you request a repair.
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          key={JSON.stringify(params)}
          fallback={<CardGridSkeleton count={3} />}
        >
          <ServiceResults params={params} />
        </Suspense>
      </div>
    </div>
  );
}
