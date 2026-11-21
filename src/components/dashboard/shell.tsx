"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  CalendarCheck,
  CalendarDays,
  CreditCard,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ReceiptText,
  ShieldCheck,
  UserCog,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/site/navbar";
import { PageLoader } from "@/components/ui/loaders";
import { dashboardFor, useAuth } from "@/components/providers/auth-provider";
import { authClient } from "@/lib/auth-client";
import { ROLE_BADGE_CLASS, ROLE_LABEL } from "@/lib/constants";
import type { Role } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV: Record<Role, NavItem[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: CalendarCheck },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: CreditCard },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/technician/add-service", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: Wrench },
    { href: "/dashboard/technician/requests", label: "Manage Requests", icon: Inbox },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Service Approval", icon: ShieldCheck },
    { href: "/dashboard/admin/bookings", label: "All Bookings", icon: CalendarDays },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: ReceiptText },
  ],
};

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // A logged-in user may only open their own role's dashboard.
    const home = dashboardFor(user.role);
    const isSharedRoute = pathname.startsWith("/dashboard/profile");
    if (!isSharedRoute && !pathname.startsWith(home)) {
      router.replace(home);
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return <PageLoader label="Checking your session…" />;
  }

  const items = NAV[user.role];
  const home = dashboardFor(user.role);

  async function signOut() {
    await authClient.signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-ink-950 text-ink-300">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <Logo tone="light" />
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="grid size-8 place-items-center rounded-lg text-ink-400 hover:bg-white/10 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="size-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-[0.18em] text-ink-500 uppercase">
          {ROLE_LABEL[user.role]} workspace
        </p>
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-500 text-white"
                  : "text-ink-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <p className="px-3 pt-5 pb-1 text-[10px] font-semibold tracking-[0.18em] text-ink-500 uppercase">
          Account
        </p>
        <Link
          href="/dashboard/profile"
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname === "/dashboard/profile"
              ? "bg-brand-500 text-white"
              : "text-ink-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <UserCog className="size-4 shrink-0" />
          Update Profile
        </Link>
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href={home}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-white"
        >
          <LayoutDashboard className="size-4" /> My dashboard
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4" /> Back to Home
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="size-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50/70">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative h-full w-72 max-w-[85%]">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="grid size-10 place-items-center rounded-xl border border-ink-200 text-ink-700 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">
                Hello, {user.name.split(" ")[0]}
              </p>
              <p className="truncate text-xs text-ink-500">{user.email}</p>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="hidden text-xs font-semibold text-ink-500 hover:text-ink-900 sm:block"
              >
                Back to site
              </Link>
              <span className={`badge hidden sm:inline-flex ${ROLE_BADGE_CLASS[user.role]}`}>
                {ROLE_LABEL[user.role]}
              </span>
              <Link href="/dashboard/profile" className="flex items-center gap-2">
                <Avatar name={user.name} image={user.image} />
                <span className="hidden max-w-32 truncate text-sm font-medium text-ink-900 md:block">
                  {user.name}
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
