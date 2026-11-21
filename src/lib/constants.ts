import {
  AirVent,
  Laptop,
  Refrigerator,
  Smartphone,
  Tv,
  WashingMachine,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type {
  ApprovalStatus,
  BookingStatus,
  PaymentStatus,
  Role,
  ServiceCategory,
} from "./types";

export interface CategoryMeta {
  name: ServiceCategory;
  icon: LucideIcon;
  blurb: string;
  tint: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    name: "Smartphone",
    icon: Smartphone,
    blurb: "Screens, batteries & water damage",
    tint: "bg-orange-50 text-brand-600",
  },
  {
    name: "Laptop & PC",
    icon: Laptop,
    blurb: "Keyboards, boards & deep cleaning",
    tint: "bg-sky-50 text-sky-600",
  },
  {
    name: "AC",
    icon: AirVent,
    blurb: "Servicing, gas refill & repairs",
    tint: "bg-cyan-50 text-cyan-600",
  },
  {
    name: "Refrigerator",
    icon: Refrigerator,
    blurb: "Cooling faults & compressors",
    tint: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "TV",
    icon: Tv,
    blurb: "Panels, backlights & power boards",
    tint: "bg-violet-50 text-violet-600",
  },
  {
    name: "Washing Machine",
    icon: WashingMachine,
    blurb: "Drums, belts & drainage",
    tint: "bg-pink-50 text-pink-600",
  },
  {
    name: "Electrical",
    icon: Zap,
    blurb: "Wiring, fans & safety checks",
    tint: "bg-amber-50 text-amber-600",
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((category) => category.name);
export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const BOOKING_STATUS_CLASS: Record<BookingStatus, string> = {
  requested: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  accepted: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  "in-progress": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
  cancelled: "bg-ink-100 text-ink-600 ring-1 ring-ink-200",
};

export const APPROVAL_STATUS_CLASS: Record<ApprovalStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export const PAYMENT_STATUS_CLASS: Record<PaymentStatus, string> = {
  unpaid: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export const ROLE_BADGE_CLASS: Record<Role, string> = {
  customer: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  technician: "bg-brand-50 text-brand-700 ring-1 ring-brand-200",
  admin: "bg-ink-900 text-white",
};

export const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

export const DASHBOARD_HOME: Record<Role, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};
