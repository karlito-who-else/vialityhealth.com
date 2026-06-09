import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";

function ResetPasswordPageContent() {
  return (
    <div className="container px-4 py-16">
      <div className="max-w-xl mx-auto">
        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  description: "Reset your password.",
  openGraph: mergeOpenGraph({
    title: "Reset Password",
    url: "/reset-password",
  }),
  title: "Reset Password",
};
