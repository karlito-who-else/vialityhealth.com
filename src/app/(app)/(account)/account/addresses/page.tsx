import configPromise from "@payload-config";
import type { Metadata } from "next";
import { headers as getHeaders } from "next/headers.js";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import { AddressListing } from "@/components/addresses/AddressListing";
import { CreateAddressModal } from "@/components/addresses/CreateAddressModal";
import { Order } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";

export default async function AddressesPage() {
  const [headers, payload] = await Promise.all([getHeaders(), getPayload({ config: configPromise })]);
  const [{ user }, settings] = await Promise.all([
    payload.auth({ headers }),
    getCachedGlobal("settings", 1)(),
  ]);

  const loginWarning = settings?.loginWarning || "Please login to access your account settings.";
  const addressesHeading = settings?.addressesHeading || "Addresses";

  let _orders: Order[] | null = null;

  if (!user) {
    redirect(`/login?warning=${encodeURIComponent(loginWarning)}`);
  }

  try {
    const ordersResult = await payload.find({
      collection: "orders",
      limit: 5,
      user,
      overrideAccess: false,
      pagination: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    });

    _orders = ordersResult?.docs || [];
  } catch (_error) {
    console.error("Error fetching orders:", _error);
  }

  return (
    <>
      <div className="border p-8 rounded-lg bg-primary-foreground">
        <h1 className="text-3xl font-medium mb-8">{addressesHeading}</h1>

        <div className="mb-8">
          <AddressListing />
        </div>

        <CreateAddressModal />
      </div>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedGlobal("settings", 1)();

  return {
    description: "Manage your addresses.",
    openGraph: mergeOpenGraph({
      title: settings?.addressesHeading || "Addresses",
      url: "/account/addresses",
    }),
    title: settings?.addressesHeading || "Addresses",
  };
}
