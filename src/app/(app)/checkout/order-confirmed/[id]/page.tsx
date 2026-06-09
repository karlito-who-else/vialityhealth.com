import configPromise from "@payload-config";
import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import { headers as getHeaders } from "next/headers.js";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

import { AddressItem } from "@/components/addresses/AddressItem";
import { Link } from "@/components/atoms/Link";
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

export default async function OrderConfirmed({
  params,
  searchParams,
}: PageProps) {
  const [headers, payload] = await Promise.all([
    getHeaders(),
    getPayload({ config: configPromise }),
  ]);
  const [{ user }, settings] = await Promise.all([
    payload.auth({ headers }),
    getCachedGlobal("settings", 1)(),
  ]);

  const orderNumberPrefix = settings?.orderNumberPrefix || "Order #";
  const orderDateLabel = settings?.orderDateLabel || "Order Date";
  const totalLabel = settings?.totalLabel || "Total";
  const statusLabel = settings?.statusLabel || "Status";
  const itemsLabel = settings?.itemsLabel || "Items";
  const itemUnavailableText =
    settings?.itemUnavailableText || "This item is no longer available.";
  const shippingAddressLabel =
    settings?.shippingAddressLabel || "Shipping Address";

  const [{ id }, { email = "", accessToken = "" }] = await Promise.all([
    params,
    searchParams,
  ]);

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
          { id: { equals: id } },
          ...(user
            ? [{ customer: { equals: user.id } }]
            : [
                ...(accessToken
                  ? [{ accessToken: { equals: accessToken } }]
                  : []),
                ...(email
                  ? [{ customerEmail: { equals: email } }]
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
        shippingMethod: true,
      },
    });

    const canAccessAsGuest =
      !user &&
      email &&
      accessToken &&
      orderResult &&
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

  const showBankInfo = settings?.bankTransferEnabled;

  return (
    <div className="container mx-auto min-h-[90vh] py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {user && (
          <Button asChild variant="ghost" className="self-start">
            <Link href="/orders">
              <ChevronLeftIcon />
              All orders
            </Link>
          </Button>
        )}

        {showBankInfo && (
          <div className="scheme-only-light py-6 md:py-32 px-6 bg-primary text-primary-foreground text-center">
            <h1 className="font-serif uppercase font-light text-4xl mb-4">Order placed</h1>
            <p className="text-primary-foreground text-balance">
              {settings?.bankTransferNote ||
                "Your order will be shipped once your bank transfer is confirmed. Please transfer the total amount to the account below:"}
            </p>
          </div>
        )}

        {!showBankInfo && (
          <h1 className="text-2xl font-medium">Order placed</h1>
        )}

        {showBankInfo && (
          <div className="bg-card border rounded-lg p-6 space-y-3">
            <h2 className="font-semibold text-lg">
              {settings?.bankTransferHeading || "Bank Transfer"}
            </h2>
            <div className="space-y-2 text-sm">
              {settings?.bankName && (
                <div className="flex justify-between">
                  <span className="text-primary/60">Bank</span>
                  <span className="font-medium">{settings.bankName}</span>
                </div>
              )}
              {settings?.accountName && (
                <div className="flex justify-between">
                  <span className="text-primary/60">Account Name</span>
                  <span className="font-medium">{settings.accountName}</span>
                </div>
              )}
              {settings?.accountNumber && (
                <div className="flex justify-between">
                  <span className="text-primary/60">Account Number</span>
                  <span className="font-medium">{settings.accountNumber}</span>
                </div>
              )}
              {settings?.routingNumber && (
                <div className="flex justify-between">
                  <span className="text-primary/60">Routing / Sort Code</span>
                  <span className="font-medium">{settings.routingNumber}</span>
                </div>
              )}
              {settings?.swiftCode && (
                <div className="flex justify-between">
                  <span className="text-primary/60">SWIFT / BIC</span>
                  <span className="font-medium">{settings.swiftCode}</span>
                </div>
              )}
            </div>
            {settings?.bankTransferFooter && (
              <p className="text-xs text-primary/50">{settings.bankTransferFooter}</p>
            )}
            {order.amount && (
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-base font-medium">
                  <span>Total to transfer</span>
                  <Price amount={order.amount} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-card border rounded-lg p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-sm uppercase font-sans px-2 bg-primary/10 rounded tracking-wider">
              {`${orderNumberPrefix}${order.id}`}
            </h2>

            {order.status && (
              <OrderStatus className="text-sm" status={order.status} />
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between">
              <div>
                <p className="font-sans uppercase text-primary/50 mb-1 text-sm">
                  {orderDateLabel}
                </p>
                <p className="text-lg">
                  <time dateTime={order.createdAt}>
                    {formatDateTime({
                      date: order.createdAt,
                      format: "MMMM dd, yyyy",
                    })}
                  </time>
                </p>
              </div>

              <div className="text-right">
                <p className="font-sans uppercase text-primary/50 mb-1 text-sm">
                  {totalLabel}
                </p>
                {order.amount && (
                  <Price className="text-lg" amount={order.amount} />
                )}
              </div>

              <div>
                <p className="font-sans uppercase text-primary/50 mb-1 text-sm">
                  {statusLabel}
                </p>
                {order.status && (
                  <OrderStatus className="text-sm" status={order.status} />
                )}
              </div>
            </div>
          </div>

          {order.items && (
            <div className="mt-8">
              <h2 className="font-sans text-primary/50 mb-4 uppercase text-sm">
                {itemsLabel}
              </h2>
              <ul className="flex flex-col gap-6">
                {order.items?.map((item, index) => {
                  if (typeof item.product === "string") {
                    return null;
                  }

                  if (!item.product || typeof item.product !== "object") {
                    return (
                      <div key={item.id || index}>
                        {itemUnavailableText}
                      </div>
                    );
                  }

                  const variant =
                    item.variant && typeof item.variant === "object"
                      ? item.variant
                      : undefined;

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

          {order.shippingMethod && (
            <div className="mt-8">
              <h2 className="font-sans text-primary/50 mb-4 uppercase text-sm">
                Shipping Method
              </h2>
              <div className="flex items-center justify-between px-4 py-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">
                    {(order.shippingMethod as any)?.serviceName}
                  </p>
                  <p className="text-xs text-primary/50 mt-0.5">
                    {(order.shippingMethod as any)?.timeframe}
                  </p>
                </div>
                <Price amount={(order.shippingMethod as any)?.cost} />
              </div>
            </div>
          )}

          {order.shippingAddress && (
            <div className="mt-8">
              <h2 className="font-sans text-primary/50 mb-4 uppercase text-sm">
                {shippingAddressLabel}
              </h2>

              {/* @ts-expect-error - some kind of type hell */}
              <AddressItem address={order.shippingAddress} hideActions />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const [{ id }, settings] = await Promise.all([
    params,
    getCachedGlobal("settings", 1)(),
  ]);

  return {
    description: `Order ${settings?.orderNumberPrefix || "Order #"}${id} placed.`,
    openGraph: mergeOpenGraph({
      title: `Order placed - ${settings?.orderNumberPrefix || "Order #"}${id}`,
      url: `/checkout/order-confirmed/${id}`,
    }),
    title: `Order placed - ${settings?.orderNumberPrefix || "Order #"}${id}`,
  };
}
