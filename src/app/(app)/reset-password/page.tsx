import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <div className="container px-4 py-16">
      <div className="max-w-xl mx-auto">
        <ResetPasswordForm token={token} />
      </div>
    </div>
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
