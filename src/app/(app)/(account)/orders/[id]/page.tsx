import configPromise from "@payload-config";
import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import { headers as getHeaders } from "next/headers.js";
import { Link } from "@/components/atoms/Link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

import { AddressItem } from "@/components/addresses/AddressItem";
import { OrderStatus } from "@/components/OrderStatus";
import { Price } from "@/components/Price";
import { ProductItem } from "@/components/ProductItem";
import { Button } from "@/components/ui/button";
import type { Order } from "@/payload-types";
import { formatDateTime } from "@/utilities/formatDateTime";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ email?: string; accessToken?: string }>;
};

export default async function Order({ params, searchParams }: PageProps) {
  const [headers, payload] = await Promise.all([getHeaders(), getPayload({ config: configPromise })]);
  const [{ user }, settings] = await Promise.all([
    payload.auth({ headers }),
    getCachedGlobal("settings", 1)(),
  ]);

  const allOrdersLabel = settings?.allOrdersLabel || "All orders";
  const orderNumberPrefix = settings?.orderNumberPrefix || "Order #";
  const orderDateLabel = settings?.orderDateLabel || "Order Date";
  const totalLabel = settings?.totalLabel || "Total";
  const statusLabel = settings?.statusLabel || "Status";
  const itemsLabel = settings?.itemsLabel || "Items";
  const itemUnavailableText = settings?.itemUnavailableText || "This item is no longer available.";
  const shippingAddressLabel = settings?.shippingAddressLabel || "Shipping Address";

  const [{ id }, { email = "", accessToken = "" }] = await Promise.all([params, searchParams]);

  let order: Order | null = null;

  try {
    const {
      docs: [orderResult],
    } = await payload.find({
      collection: "orders",
      user,
      overrideAccess: !user,
      depth: 2,
      where: {
        and: [
          {
            id: {
              equals: id,
            },
          },
          ...(user
            ? [
                {
                  customer: {
                    equals: user.id,
                  },
                },
              ]
            : [
                {
                  accessToken: {
                    equals: accessToken,
                  },
                },
                ...(email
                  ? [
                      {
                        customerEmail: {
                          equals: email,
                        },
                      },
                    ]
                  : []),
              ]),
        ],
      },
      select: {
        amount: true,
        currency: true,
        items: true,
        customerEmail: true,
        customer: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        shippingAddress: true,
      },
    });

    const canAccessAsGuest =
      !user &&
      email &&
      accessToken &&
      orderResult &&
      orderResult.customerEmail &&
      orderResult.customerEmail === email;
    const canAccessAsUser =
      user &&
      orderResult &&
      orderResult.customer &&
      (typeof orderResult.customer === "object"
        ? orderResult.customer.id
        : orderResult.customer) === user.id;

    if (orderResult && (canAccessAsGuest || canAccessAsUser)) {
      order = orderResult;
    }
  } catch (error) {
    console.error(error);
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="">
      <div className="flex gap-8 justify-between items-center mb-6">
        {user ? (
          <div className="flex gap-4">
            <Button asChild variant="ghost">
              <Link href="/orders">
                <ChevronLeftIcon />
                {allOrdersLabel}
              </Link>
            </Button>
          </div>
        ) : (
          <div></div>
        )}

        <h1 className="text-sm uppercase font-mono px-2 bg-primary/10 rounded tracking-wider">
          <span className="">{`${orderNumberPrefix}${order.id}`}</span>
        </h1>
      </div>

      <div className="bg-card border rounded-lg px-6 py-4 flex flex-col gap-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
          <div className="">
            <p className="font-mono uppercase text-primary/50 mb-1 text-sm">{orderDateLabel}</p>
            <p className="text-lg">
              <time dateTime={order.createdAt}>
                {formatDateTime({ date: order.createdAt, format: "MMMM dd, yyyy" })}
              </time>
            </p>
          </div>

          <div className="">
            <p className="font-mono uppercase text-primary/50 mb-1 text-sm">{totalLabel}</p>
            {order.amount && <Price className="text-lg" amount={order.amount} />}
          </div>

          {order.status && (
            <div className="grow max-w-1/3">
              <p className="font-mono uppercase text-primary/50 mb-1 text-sm">{statusLabel}</p>
              <OrderStatus className="text-sm" status={order.status} />
            </div>
          )}
        </div>

        {order.items && (
          <div>
            <h2 className="font-mono text-primary/50 mb-4 uppercase text-sm">{itemsLabel}</h2>
            <ul className="flex flex-col gap-6">
              {order.items?.map((item, index) => {
                if (typeof item.product === "string") {
                  return null;
                }

                if (!item.product || typeof item.product !== "object") {
                  return <div key={item.id || index}>{itemUnavailableText}</div>;
                }

                const variant =
                  item.variant && typeof item.variant === "object" ? item.variant : undefined;

                return (
                  <li key={item.id}>
                    <ProductItem
                      product={item.product}
                      quantity={item.quantity}
                      variant={variant}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {order.shippingAddress && (
          <div>
            <h2 className="font-mono text-primary/50 mb-4 uppercase text-sm">
              {shippingAddressLabel}
            </h2>

            {/* @ts-expect-error - some kind of type hell */}
            <AddressItem address={order.shippingAddress} hideActions />
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [{ id }, settings] = await Promise.all([params, getCachedGlobal("settings", 1)()]);

  return {
    description: `${settings?.orderNumberPrefix || "Order #"}${id} details.`,
    openGraph: mergeOpenGraph({
      title: `${settings?.orderNumberPrefix || "Order #"}${id}`,
      url: `/orders/${id}`,
    }),
    title: `${settings?.orderNumberPrefix || "Order #"}${id}`,
  };
}
