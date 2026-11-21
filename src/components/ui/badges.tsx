import { CheckCircle2, Clock, CreditCard } from "lucide-react";
import {
  APPROVAL_STATUS_CLASS,
  BOOKING_STATUS_CLASS,
  BOOKING_STATUS_LABEL,
  PAYMENT_STATUS_CLASS,
  ROLE_BADGE_CLASS,
  ROLE_LABEL,
} from "@/lib/constants";
import type { ApprovalStatus, BookingStatus, PaymentStatus, Role } from "@/lib/types";

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`badge ${BOOKING_STATUS_CLASS[status]}`}>{BOOKING_STATUS_LABEL[status]}</span>;
}

export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  return (
    <span className={`badge capitalize ${APPROVAL_STATUS_CLASS[status]}`}>
      {status === "approved" && <CheckCircle2 className="size-3.5" />}
      {status === "pending" && <Clock className="size-3.5" />}
      {status}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`badge capitalize ${PAYMENT_STATUS_CLASS[status]}`}>
      {status === "paid" ? (
        <CreditCard className="size-3.5" />
      ) : (
        <Clock className="size-3.5" />
      )}
      {status}
    </span>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  return <span className={`badge ${ROLE_BADGE_CLASS[role]}`}>{ROLE_LABEL[role]}</span>;
}
