import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your FixMate account"
      subtitle="Join as a customer to book repairs, or as a technician to offer them."
    >
      <SignUpForm />
    </AuthShell>
  );
}
