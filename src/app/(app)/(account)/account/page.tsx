import configPromise from "@payload-config";
import type { Metadata } from "next";
import { headers as getHeaders } from "next/headers.js";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import { AccountForm } from "@/components/forms/AccountForm";
import { OrderItem } from "@/components/OrderItem";
import { Button } from "@/components/ui/button";
import { Order } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";

export default async function AccountPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers });

  const settings = await getCachedGlobal("settings", 1)();

  const loginWarning = settings?.loginWarning || "Please login to access your account settings.";
  const accountHeading = settings?.accountHeading || "Account settings";
  const recentOrdersHeading = settings?.recentOrdersHeading || "Recent Orders";
  const recentOrdersDescription = settings?.recentOrdersDescription || "";
  const noOrdersText = settings?.noOrdersText || "You have no orders.";
  const viewAllOrdersLabel = settings?.viewAllOrdersLabel || "View all orders";

  let orders: Order[] | null = null;

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

    orders = ordersResult?.docs || [];
  } catch (error) {}

  return (
    <>
      <div className="border p-8 rounded-lg bg-primary-foreground">
        <h1 className="text-3xl font-medium mb-8">{accountHeading}</h1>
        <AccountForm />
      </div>

      <div className=" border p-8 rounded-lg bg-primary-foreground">
        <h2 className="text-3xl font-medium mb-8">{recentOrdersHeading}</h2>

        {recentOrdersDescription && (
          <div className="prose dark:prose-invert mb-8">
            <p>{recentOrdersDescription}</p>
          </div>
        )}

        {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
          <p className="mb-8">{noOrdersText}</p>
        )}

        {orders && orders.length > 0 && (
          <ul className="flex flex-col gap-6 mb-8">
            {orders?.map((order, index) => (
              <li key={order.id}>
                <OrderItem order={order} />
              </li>
            ))}
          </ul>
        )}

        <Button asChild variant="default">
          <Link href="/orders">{viewAllOrdersLabel}</Link>
        </Button>
      </div>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedGlobal("settings", 1)();

  return {
    description:
      settings?.loginDescription || "Create an account or log in to your existing account.",
    openGraph: mergeOpenGraph({
      title: settings?.accountHeading || "Account",
      url: "/account",
    }),
    title: settings?.accountHeading || "Account",
  };
}
