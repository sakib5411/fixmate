import Link from "next/link";
import { RotateCcw, XCircle } from "lucide-react";
import { CustomerGuard } from "@/components/auth/customer-guard";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export default function PaymentCancelPage() {
  return (
    <CustomerGuard>
      <Navbar />
      <main className="flex-1">
        <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
          <div className="w-full max-w-lg rounded-3xl border border-ink-200 bg-white p-8 text-center shadow-sm">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber-50 text-amber-600">
              <XCircle className="size-8" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink-900">
              Payment cancelled
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              Nothing was charged and your booking is unchanged. You can come back and pay whenever
              you are ready.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/dashboard/customer/bookings" className="btn-primary">
                <RotateCcw className="size-4" /> Try again
              </Link>
              <Link href="/services" className="btn-outline">
                Browse services
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </CustomerGuard>
  );
}
