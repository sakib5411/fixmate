import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Search,
  ShieldCheck,
  Wallet,
  Wrench,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const STEPS = [
  {
    title: "Find a service",
    description:
      "Search approved listings by title, category, service mode or price. Every card shows the technician, area and starting price before you commit.",
    icon: Search,
  },
  {
    title: "Send a repair request",
    description:
      "Pick a preferred date, describe the problem and share your address. The technician receives the request instantly — one active request per service.",
    icon: ClipboardList,
  },
  {
    title: "Track the repair",
    description:
      "The job moves through Requested, Accepted and In Progress. You can cancel while it is still requested and see every change in the timeline.",
    icon: Wrench,
  },
  {
    title: "Pay after completion",
    description:
      "Once the technician marks the job completed and sets the final amount, Pay Now unlocks. Stripe handles the payment securely.",
    icon: CreditCard,
  },
];

const RULES = [
  {
    title: "Nothing is paid upfront",
    description:
      "A payment is only possible when a booking is completed and still unpaid — and only by the customer who owns it.",
    icon: Wallet,
  },
  {
    title: "One active request per service",
    description:
      "You cannot open two active requests for the same service at once, so multiple technicians never show up for one job.",
    icon: CalendarDays,
  },
  {
    title: "Only the owner moves the job",
    description:
      "Each status change is validated on the server, so a job can never skip from requested straight to completed.",
    icon: ShieldCheck,
  },
  {
    title: "Every listing is reviewed",
    description:
      "Services stay pending until an admin approves them, and editing a service sends it back for review.",
    icon: BadgeCheck,
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-ink-50/70">
        <div className="container-page py-14 sm:py-20">
          <span className="badge bg-white text-ink-700 ring-1 ring-ink-200">
            <ShieldCheck className="size-3.5 text-brand-500" /> How FixMate works
          </span>
          <h1 className="h1 mt-4 max-w-3xl">
            Repair transparency, from the first click to the final payment.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
            FixMate connects customers with verified technicians for device and home appliance
            repairs. Every job has an owner, a status and a price — and money only moves when the
            work is delivered.
          </p>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.title} className="card relative p-6">
              <span className="absolute top-5 right-5 text-4xl font-semibold text-ink-100">
                0{index + 1}
              </span>
              <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <step.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-ink-900">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink-950 py-14 text-white sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase">
              Built-in safeguards
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Rules that protect both sides
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              FixMate enforces its job pipeline on the server, not just in the interface. That means
              no skipped stages, no double payments and no surprise charges.
            </p>
            <Link href="/services" className="btn-primary mt-6">
              Browse services <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {RULES.map((rule) => (
              <div key={rule.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <rule.icon className="size-5 text-brand-400" />
                <h3 className="mt-3 text-sm font-semibold">{rule.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <h2 className="h2">What we repair</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          Approved technicians cover seven categories of device and home appliance repair.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={`/services?category=${encodeURIComponent(category.name)}`}
              className="card flex items-center gap-3 p-4 transition-colors hover:border-brand-300"
            >
              <span className={`grid size-10 place-items-center rounded-lg ${category.tint}`}>
                <category.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">{category.name}</p>
                <p className="text-[11px] text-ink-500">{category.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
