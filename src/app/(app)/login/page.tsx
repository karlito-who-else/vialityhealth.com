import configPromise from "@payload-config";
import type { Metadata } from "next";
import { headers as getHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import { LoginForm } from "@/components/forms/LoginForm";
import { RenderParams } from "@/components/RenderParams";
import { getCachedGlobal } from "@/utilities/getGlobals";

export default async function Login() {
  const [headers, payload] = await Promise.all([getHeaders(), getPayload({ config: configPromise })]);
  const [{ user }, settings] = await Promise.all([
    payload.auth({ headers }),
    getCachedGlobal("settings", 1)(),
  ]);

  const alreadyLoggedInWarning = settings?.alreadyLoggedInWarning || "You are already logged in.";
  const loginHeading = settings?.loginHeading || "Log in";
  const loginDescription = settings?.loginDescription || "";

  if (user) {
    redirect(`/account?warning=${encodeURIComponent(alreadyLoggedInWarning)}`);
  }

  return (
    <div className="container">
      <div className="max-w-xl mx-auto my-12 px-4">
        <RenderParams />

        <h1 className="mb-4 text-3xl">{loginHeading}</h1>
        {loginDescription && <p className="mb-8">{loginDescription}</p>}
        <LoginForm />
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedGlobal("settings", 1)();

  return {
    description: settings?.loginDescription || "Login or create an account to get started.",
    openGraph: {
      title: settings?.loginHeading || "Login",
      url: "/login",
    },
    title: settings?.loginHeading || "Login",
  };
}
