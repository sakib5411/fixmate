import Link from "next/link";
import { ArrowRight, Clock, MapPin, UserRound } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg hover:shadow-ink-900/5">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink-800 shadow-sm">
          {service.category}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-ink-900/85 px-2.5 py-1 text-[11px] font-semibold text-white">
          {service.serviceMode}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 min-h-[3rem] text-base leading-snug font-semibold text-ink-900">
          {service.title}
        </h3>

        <div className="space-y-1.5 text-xs text-ink-500">
          <p className="flex items-center gap-1.5">
            <UserRound className="size-3.5" /> {service.technicianName}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {service.serviceArea}
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="size-3.5" /> {service.estimatedDuration}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-3">
          <div>
            <p className="text-[10px] font-semibold tracking-wide text-ink-400 uppercase">
              Starting at
            </p>
            <p className="text-lg font-semibold text-ink-900">{formatMoney(service.basePrice)}</p>
          </div>
          <Link href={`/services/${service.id}`} className="btn-primary btn-sm">
            View Details <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
