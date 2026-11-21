"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  UserCog,
  X,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { dashboardFor, useAuth } from "@/components/providers/auth-provider";
import { authClient } from "@/lib/auth-client";
import { initials } from "@/lib/format";
import { ROLE_BADGE_CLASS, ROLE_LABEL } from "@/lib/constants";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /** Closes both menus after the visitor navigates. */
  function closeMenus() {
    setMenuOpen(false);
    setDropdownOpen(false);
  }

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function signOut() {
    await authClient.signOut();
    toast.success("Signed out successfully");
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(pathname, link.href)
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? (
            <span className="size-9 animate-pulse rounded-full bg-ink-100" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-ink-200 py-1 pr-2.5 pl-1 transition-colors hover:bg-ink-50"
                aria-expanded={dropdownOpen}
                aria-label="Open account menu"
              >
                <Avatar name={user.name} image={user.image} />
                <ChevronDown className="size-4 text-ink-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-lg shadow-ink-900/5">
                  <div className="border-b border-ink-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                    <p className="truncate text-xs text-ink-500">{user.email}</p>
                    <span
                      className={`badge mt-2 ${ROLE_BADGE_CLASS[user.role]}`}
                    >
                      {ROLE_LABEL[user.role]}
                    </span>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href={dashboardFor(user.role)}
                      onClick={closeMenus}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
                    >
                      <LayoutDashboard className="size-4" /> Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={closeMenus}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
                    >
                      <UserCog className="size-4" /> Update Profile
                    </Link>
                    <button
                      type="button"
                      onClick={signOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="size-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="btn-ghost">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-10 place-items-center rounded-xl border border-ink-200 text-ink-700 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-ink-200 bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive(pathname, link.href)
                    ? "bg-ink-900 text-white"
                    : "text-ink-700 hover:bg-ink-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 border-t border-ink-100 pt-3">
              {user ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 px-3 pb-2">
                    <Avatar name={user.name} image={user.image} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                      <p className="text-xs text-ink-500">{ROLE_LABEL[user.role]}</p>
                    </div>
                  </div>
                  <Link
                    href={dashboardFor(user.role)}
                    onClick={closeMenus}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={closeMenus}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
                  >
                    Update Profile
                  </Link>
                  <button
                    type="button"
                    onClick={signOut}
                    className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-1">
                  <Link href="/sign-in" onClick={closeMenus} className="btn-outline w-full">
                    Sign In
                  </Link>
                  <Link href="/sign-up" onClick={closeMenus} className="btn-primary w-full">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Avatar({
  name,
  image,
  size = "md",
}: {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const dimensions =
    size === "lg" ? "size-16 text-lg" : size === "sm" ? "size-8 text-[11px]" : "size-8 text-xs";

  if (image) {
    return (
      // Remote avatar hosts vary (ImgBB, ui-avatars), so a plain img is used.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        className={`${dimensions} shrink-0 rounded-full border border-ink-200 object-cover`}
      />
    );
  }

  return (
    <span
      className={`${dimensions} grid shrink-0 place-items-center rounded-full bg-ink-900 font-semibold text-white`}
    >
      {initials(name) || "U"}
    </span>
  );
}
