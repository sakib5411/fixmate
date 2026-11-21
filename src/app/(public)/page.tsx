import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Search,
  ShieldCheck,
  Star,
  Wallet,
  Wrench,
  Quote,
} from "lucide-react";
import { ServiceCard } from "@/components/services/service-card";
import { CATEGORIES } from "@/lib/constants";
import { publicFetch } from "@/lib/public-api";
import type { PaginationMeta, Service } from "@/lib/types";

const STEPS = [
  {
    title: "Find a Service",
    description: "Search verified repair services by category, price or service mode.",
    icon: Search,
  },
  {
    title: "Send a Request",
    description: "Share your device problem, address and a preferred date in one form.",
    icon: ClipboardList,
  },
  {
    title: "Technician Fixes It",
    description: "Track every step from accepted to in progress to completed.",
    icon: Wrench,
  },
  {
    title: "Pay After Completion",
    description: "Only pay once the job is marked complete — securely through Stripe.",
    icon: CreditCard,
  },
];

const STATS = [
  { value: "2.4k+", label: "Jobs completed" },
  { value: "180+", label: "Verified technicians" },
  { value: "7", label: "Repair categories" },
  { value: "4.9/5", label: "Average rating" },
];

const TRUST_POINTS = [
  {
    title: "Verified technicians only",
    description: "Every technician is reviewed before their services go live.",
    icon: BadgeCheck,
  },
  {
    title: "Pay after the repair",
    description: "Money leaves your account only when the job is completed.",
    icon: Wallet,
  },
  {
    title: "Transparent job tracking",
    description: "A live status timeline for every request, from start to finish.",
    icon: CalendarCheck,
  },
  {
    title: "Protected payments",
    description: "Stripe handles the checkout — we never store card details.",
    icon: ShieldCheck,
  },
];

const TESTIMONIALS = [
  {
    name: "Nusrat Jahan",
    area: "Dhanmondi, Dhaka",
    quote:
      "My laptop keyboard died on a deadline day. A FixMate technician came the same evening and I paid only after it worked.",
  },
  {
    name: "Tanvir Ahmed",
    area: "Uttara, Dhaka",
    quote:
      "I could see the job status change from accepted to completed. No more calling five numbers to ask what is happening.",
  },
  {
    name: "Farhana Islam",
    area: "Mirpur, Dhaka",
    quote:
      "The AC servicing was priced exactly as shown on the card. Clean work, no surprise charges at the end.",
  },
];

export default async function HomePage() {
  const featured = await publicFetch<Service[], PaginationMeta>(
    "/api/services?limit=6&sort=newest"
  );
  const services = featured?.data ?? [];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -top-40 -right-32 size-[32rem] rounded-full bg-brand-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-40 size-[28rem] rounded-full bg-sky-100/50 blur-3xl" />

        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-white">
              <ShieldCheck className="size-3.5 text-brand-400" />
              Verified technicians · Pay after service
            </span>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Broken device?
              <span className="block text-brand-500">Get it fixed by pros.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
              Book trusted technicians for smartphones, laptops, ACs, refrigerators, TVs, washing
              machines and electrical work. Track every job step by step and pay only when the
              repair is done.
            </p>

            <form action="/services" className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="search"
                  name="search"
                  placeholder="Try “iPhone screen”, “AC servicing”…"
                  className="input rounded-full py-3.5 pl-11"
                  aria-label="Search repair services"
                />
              </div>
              <button type="submit" className="btn-primary px-6 py-3.5">
                Find a Service <ArrowRight className="size-4" />
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-500">
              <span className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-emerald-500" /> Vetted technicians
              </span>
              <span className="flex items-center gap-2">
                <Wallet className="size-4 text-brand-500" /> No upfront payment
              </span>
              <span className="flex items-center gap-2">
                <Star className="size-4 text-amber-400" /> 4.9 average rating
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg animate-fade-up lg:max-w-none">
            <div className="overflow-hidden rounded-3xl border border-ink-200 bg-ink-900 shadow-2xl shadow-ink-900/20">
              <Image
                src="/images/hero-technician.jpg"
                alt="A FixMate technician repairing a smartphone at a workbench"
                width={1184}
                height={880}
                priority
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -left-2 w-60 rounded-2xl border border-ink-200 bg-white p-4 shadow-xl sm:left-4">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <BadgeCheck className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-ink-900">Job completed</p>
                  <p className="text-[11px] text-ink-500">iPhone Screen Replacement</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                <div className="h-full w-full rounded-full bg-emerald-500" />
              </div>
              <p className="mt-2 text-[11px] text-ink-500">Pay now unlocked · $89.00</p>
            </div>
          </div>
        </div>

        <div className="border-y border-ink-200/70 bg-ink-50/70">
          <div className="container-page grid grid-cols-2 gap-6 py-7 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="text-2xl font-semibold text-ink-900">{stat.value}</p>
                <p className="text-xs font-medium tracking-wide text-ink-500 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured services ─────────────────────────────── */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-600 uppercase">
              Latest listings
            </p>
            <h2 className="h2 mt-2">Featured repair services</h2>
            <p className="mt-2 max-w-xl text-sm text-ink-500">
              Freshly approved services from verified technicians, ready to book today.
            </p>
          </div>
          <Link href="/services" className="btn-outline shrink-0">
            Browse all services <ArrowRight className="size-4" />
          </Link>
        </div>

        {services.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-ink-200 bg-ink-50 px-6 py-14 text-center">
            <p className="font-semibold text-ink-900">Services are being prepared</p>
            <p className="mt-1 text-sm text-ink-500">
              New listings appear here as soon as an admin approves them.
            </p>
          </div>
        )}
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section id="how-it-works" className="bg-ink-950 py-16 text-white sm:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase">
              Simple process
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              How FixMate works
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-300 sm:text-base">
              Four clear steps from a broken device to a verified repair — with no upfront payment.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <span className="absolute top-5 right-5 text-4xl font-semibold text-white/10">
                  0{index + 1}
                </span>
                <span className="grid size-11 place-items-center rounded-xl bg-brand-500 text-white">
                  <step.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-600 uppercase">
              What we fix
            </p>
            <h2 className="h2 mt-2">Popular categories</h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            See everything →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={`/services?category=${encodeURIComponent(category.name)}`}
              className="card group flex items-center gap-4 p-5 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
            >
              <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${category.tint}`}>
                <category.icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink-900">{category.name}</span>
                <span className="mt-0.5 block text-xs text-ink-500">{category.blurb}</span>
              </span>
              <ArrowRight className="ml-auto size-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
            </Link>
          ))}

          <div className="flex items-center gap-4 rounded-2xl bg-brand-500 p-5 text-white">
            <Wrench className="size-9 shrink-0 opacity-90" />
            <div>
              <p className="text-sm font-semibold">Not sure what you need?</p>
              <Link href="/services" className="mt-1 inline-block text-xs underline">
                Browse every service
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why choose us ────────────────────────────────── */}
      <section className="bg-ink-50/80 py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-600 uppercase">
              Why FixMate
            </p>
            <h2 className="h2 mt-2">Repairs you can actually follow</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Most people hand over a device and lose visibility. FixMate keeps the technician, the
              price and the status in one place — so nothing is a guess.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {TRUST_POINTS.map((point) => (
                <div key={point.title} className="rounded-2xl border border-ink-200 bg-white p-5">
                  <span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <point.icon className="size-4" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-ink-900">{point.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">{point.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm"
              >
                <Quote className="size-6 text-brand-300" />
                <blockquote className="mt-3 text-sm leading-relaxed text-ink-700">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-ink-900 text-xs font-semibold text-white">
                    {testimonial.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{testimonial.name}</p>
                    <p className="text-xs text-ink-500">{testimonial.area}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="size-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="container-page py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-12 sm:px-12">
          <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Ready when your device is not
              </h2>
              <p className="mt-2 max-w-xl text-sm text-ink-300">
                Browse verified repair services, or join FixMate as a technician and grow your
                repair business with a steady flow of jobs.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/services" className="btn-primary">
                Book a repair
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Join as technician
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
