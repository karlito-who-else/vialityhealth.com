import configPromise from "@payload-config";
import type { Metadata } from "next";
import { headers as getHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import { CreateAccountForm } from "@/components/forms/CreateAccountForm";
import { RenderParams } from "@/components/RenderParams";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";

export default async function CreateAccount() {
  const [headers, payload] = await Promise.all([getHeaders(), getPayload({ config: configPromise })]);
  const [{ user }, settings] = await Promise.all([
    payload.auth({ headers }),
    getCachedGlobal("settings", 1)(),
  ]);

  const alreadyLoggedInWarning = settings?.alreadyLoggedInWarning || "You are already logged in.";
  const createAccountHeading = settings?.createAccountHeading || "Create Account";

  if (user) {
    redirect(`/account?warning=${encodeURIComponent(alreadyLoggedInWarning)}`);
  }

  return (
    <div className="container px-4 py-16">
      <h1 className="text-xl mb-4">{createAccountHeading}</h1>
      <RenderParams />
      <CreateAccountForm />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedGlobal("settings", 1)();

  return {
    description: settings?.createAccountHeading
      ? `Create an ${settings.createAccountHeading.toLowerCase()} or log in to your existing account.`
      : "Create an account or log in to your existing account.",
    openGraph: mergeOpenGraph({
      title: settings?.createAccountHeading || "Account",
      url: "/account",
    }),
    title: settings?.createAccountHeading || "Account",
  };
}
