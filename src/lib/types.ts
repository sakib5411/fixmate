export type Role = "customer" | "technician" | "admin";

export type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ServiceMode = "Home Visit" | "Shop Drop-off";

export type ServiceCategory =
  | "Smartphone"
  | "Laptop & PC"
  | "AC"
  | "Refrigerator"
  | "TV"
  | "Washing Machine"
  | "Electrical";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  phone?: string | null;
  area?: string | null;
  bio?: string | null;
  createdAt?: string;
}

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryEntry {
  status: BookingStatus;
  changedAt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: ServiceCategory;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  statusHistory?: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
}

export interface MonthPoint {
  month: string;
  value: number;
}

export interface CustomerStats {
  totalRequests: number;
  activeJobs: number;
  completedJobs: number;
  totalSpent: number;
  statusBreakdown: Record<string, number>;
  monthlyBookings: MonthPoint[];
}

export interface TechnicianStats {
  totalServices: number;
  approvedServices: number;
  pendingServices: number;
  pendingRequests: number;
  activeJobs: number;
  completedJobs: number;
  totalEarnings: number;
  statusBreakdown: Record<string, number>;
  monthlyEarnings: MonthPoint[];
}

export interface AdminStats {
  totalUsers: number;
  totalTechnicians: number;
  totalCustomers: number;
  pendingServices: number;
  approvedServices: number;
  totalBookings: number;
  totalRevenue: number;
  statusBreakdown: Record<string, number>;
  monthlyRevenue: MonthPoint[];
  monthlyBookings: MonthPoint[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sort: string;
}
