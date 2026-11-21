import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { CATEGORY_NAMES } from "@/lib/constants";

function XLogo({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookLogo({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramLogo({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinLogo({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.06c.53-1 1.83-2.05 3.76-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.03-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H9z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-ink-950 text-ink-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
            Verified repair technicians for your devices and home appliances — with a clear job
            timeline and payment only after the work is done.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[XLogo, FacebookLogo, InstagramLogo, LinkedinLogo].map((Icon, index) => (
              <a
                key={index}
                href="#"
                aria-label="Social profile"
                className="grid size-9 place-items-center rounded-full bg-white/5 text-ink-300 transition-colors hover:bg-brand-500 hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/services", label: "Services" },
              { href: "/about", label: "How It Works" },
              { href: "/sign-up", label: "Become a Technician" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-brand-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Popular Categories</h3>
          <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm">
            {CATEGORY_NAMES.slice(0, 5).map((category) => (
              <li key={category}>
                <Link
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="transition-colors hover:text-brand-400"
                >
                  {category} repair
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 text-brand-400" />
              <span>support@fixmate.dev</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 text-brand-400" />
              <span>+880 1700 000 001</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 text-brand-400" />
              <span>House 12, Road 5, Gulshan, Dhaka 1212</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <p>Pay after service · Verified technicians · Transparent pricing</p>
        </div>
      </div>
    </footer>
  );
}
