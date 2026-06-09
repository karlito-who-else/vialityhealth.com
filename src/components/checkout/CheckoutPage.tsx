"use client";

import { Link } from "@/components/atoms/Link";
import { useAddresses, useCart, usePayments } from "@payloadcms/plugin-ecommerce/client/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { createBankTransferOrder } from "@/actions/createBankTransferOrder";
import { AddressItem } from "@/components/addresses/AddressItem";
import { CreateAddressModal } from "@/components/addresses/CreateAddressModal";
import { CheckoutAddresses } from "@/components/checkout/CheckoutAddresses";
import { CheckoutForm } from "@/components/forms/CheckoutForm";
import { FormItem } from "@/components/forms/FormItem";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Media } from "@/components/Media";
import { Message } from "@/components/Message";
import { Price } from "@/components/Price";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cssVariables } from "@/cssVariables";
import { Address } from "@/payload-types";
import { useAuth } from "@/providers/Auth";
import { env } from "@/utilities/env";

const apiKey = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripe = apiKey ? loadStripe(apiKey) : null;

interface BankTransferInfo {
  heading?: string | null;
  note?: string | null;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  routingNumber?: string | null;
  swiftCode?: string | null;
  bankTransferFooter?: string | null;
}

interface ShippingOption {
  serviceName: string;
  timeframe: string;
  cost: number;
}

export const CheckoutPage: React.FC<{ bankTransfer?: BankTransferInfo; shippingOptions?: ShippingOption[] }> = ({ bankTransfer, shippingOptions }) => {
  const { user } = useAuth();
  const { push, refresh } = useRouter();
  const { cart, clearCart } = useCart();
  const [error, setError] = useState<null | string>(null);
  /**
   * State to manage the email input for guest checkout.
   */
  const [email, setEmail] = useState("");
  const [emailEditable, setEmailEditable] = useState(true);
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null);
  const { initiatePayment } = usePayments();
  const { addresses } = useAddresses();
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>();
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>();
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true);
  const [isProcessingPayment, setProcessingPayment] = useState(false);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<string | undefined>(
    shippingOptions?.[0]?.serviceName,
  );

  const shippingCost =
    (shippingOptions?.find((opt) => opt.serviceName === selectedShipping)?.cost ?? 0) * 100;

  const totalWithShipping = (cart?.subtotal ?? 0) + shippingCost;

  const cartIsEmpty = !cart || !cart.items || !cart.items.length;

  const canGoToPayment = Boolean(
    (email || user) && billingAddress && (billingAddressSameAsShipping || shippingAddress),
  );

  // On initial load wait for addresses to be loaded and check to see if we can prefill a default one
  useEffect(() => {
    if (!shippingAddress) {
      if (addresses && addresses.length > 0) {
        const defaultAddress = addresses[0];
        if (defaultAddress) {
          setBillingAddress(defaultAddress);
        }
      }
    }
  }, [addresses]);

  useEffect(() => {
    return () => {
      setShippingAddress(undefined);
      setBillingAddress(undefined);
      setBillingAddressSameAsShipping(true);
      setEmail("");
      setEmailEditable(true);
    };
  }, []);

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {
        const pmData = {
          ...(email ? { customerEmail: email } : {}),
          billingAddress,
          shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
          ...(selectedShipping
            ? {
                shippingMethod: shippingOptions?.find(
                  (opt) => opt.serviceName === selectedShipping,
                ),
              }
            : {}),
        };

        const paymentData = (await initiatePayment(paymentID, {
          additionalData: pmData,
        })) as Record<string, unknown>;

        if (paymentData) {
          setPaymentData(paymentData);
        }
      } catch (error) {
        const errorData = error instanceof Error ? JSON.parse(error.message) : {};
        let errorMessage = "An error occurred while initiating payment.";

        if (errorData?.cause?.code === "OutOfStock") {
          errorMessage = "One or more items in your cart are out of stock.";
        }

        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [billingAddress, billingAddressSameAsShipping, email, shippingAddress, selectedShipping, shippingOptions],
  );

  const handleConfirmOrder = useCallback(async () => {
    if (!cart || !cart.items || !canGoToPayment) return;

    setIsConfirmingOrder(true);

    try {
      const orderItems = cart.items
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .filter((item) => item.product != null)
        .map((item) => ({
          product: typeof item.product === "object" ? item.product.id : (item.product as number),
          variant: item.variant && typeof item.variant === "object" ? item.variant.id : (item.variant as number | undefined),
          quantity: item.quantity,
        }));

      const address = billingAddressSameAsShipping ? billingAddress : shippingAddress;

      const shippingMethod = shippingOptions?.find(
        (opt) => opt.serviceName === selectedShipping,
      );

      const result = await createBankTransferOrder({
        items: orderItems,
        shippingAddress: {
          title: address?.title,
          firstName: address?.firstName,
          lastName: address?.lastName,
          company: address?.company,
          addressLine1: address?.addressLine1,
          addressLine2: address?.addressLine2,
          city: address?.city,
          state: address?.state,
          postalCode: address?.postalCode,
          country: address?.country,
          phone: address?.phone,
        },
        customer: user?.id || null,
        customerEmail: email || null,
        amount: totalWithShipping,
        shippingMethod,
      });

      if (result?.orderID) {
        const queryParams = new URLSearchParams();
        if (email) {
          queryParams.set("email", email);
        }
        if (result.accessToken) {
          queryParams.set("accessToken", result.accessToken);
        }

        const queryString = queryParams.toString();
        const redirectUrl = `/checkout/order-confirmed/${result.orderID}${queryString ? `?${queryString}` : ""}`;

        clearCart();
        push(redirectUrl);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Something went wrong.";
      setError(msg);
      toast.error(msg);
      setIsConfirmingOrder(false);
    }
  }, [cart, canGoToPayment, billingAddressSameAsShipping, billingAddress, shippingAddress, user, email, clearCart, push, shippingOptions, selectedShipping, totalWithShipping]);

  if (!bankTransfer && !stripe) return null;

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="py-12 w-full items-center justify-center">
        <div className="prose text-center max-w-none self-center mb-8">
          <p>Processing your payment…</p>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (cartIsEmpty) {
    return (
      <div className="prose py-12 w-full items-center">
        <p>Your cart is empty.</p>
        <Link href="/search">Continue shopping?</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch justify-stretch mx-auto my-8 md:flex-row grow gap-10 md:gap-6 lg:gap-8">
      <div className="basis-full lg:basis-2/3 flex flex-col gap-8 justify-stretch px-4">
        <h2 className="font-medium text-3xl">Contact</h2>
        {user ? (
          <div className="bg-accent dark:bg-card rounded-lg p-4 ">
            <div>
              <p>{user.email}</p>{" "}
              <p>
                Not you?{" "}
                <Link className="underline" href="/logout">
                  Log out
                </Link>
              </p>
            </div>
          </div>
        ) : !emailEditable && email ? (
          <div className="bg-accent dark:bg-card rounded-lg p-4 ">
            <div>
              <p>{email}</p>{" "}
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Not you?</span>
                <Link className="underline" href="/login">
                  Log in
                </Link>
                <span>or</span>
                <button
                  className="underline bg-transparent border-0 p-0 cursor-pointer font-inherit"
                  onClick={() => {
                    setEmail("");
                    setEmailEditable(true);
                  }}
                  type="button"
                >
                  Use a different email
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-accent dark:bg-ink-well rounded-lg p-4 ">
            <div>
              <p className="mb-4">Enter your email to checkout as a guest.</p>

              <FormItem className="mb-6">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  disabled={!emailEditable}
                  id="email"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                />
              </FormItem>

              <Button
                disabled={!email || !emailEditable}
                onClick={(e) => {
                  e.preventDefault();
                  setEmailEditable(false);
                }}
                variant="default"
              >
                Continue as guest
              </Button>

              <p className="mt-4 text-sm">
                Already have an account?{" "}
                <Link className="underline" href="/login">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        )}

        <h2 className="font-medium text-3xl">Address</h2>

        {billingAddress ? (
          <div>
            <AddressItem
              actions={
                <Button
                  variant={"outline"}
                  disabled={Boolean(paymentData)}
                  onClick={(e) => {
                    e.preventDefault();
                    setBillingAddress(undefined);
                  }}
                >
                  Remove
                </Button>
              }
              address={billingAddress}
              addressType="billing"
            />
          </div>
        ) : user ? (
          <CheckoutAddresses heading="Billing address" setAddress={setBillingAddress} addressType="billing" />
        ) : (
          <CreateAddressModal
            disabled={!email || Boolean(emailEditable)}
            callback={(address) => {
              setBillingAddress(address);
            }}
            skipSubmission={true}
            addressType="billing"
          />
        )}

        <div className="flex gap-4 items-center">
          <Checkbox
            id="shippingTheSameAsBilling"
            checked={billingAddressSameAsShipping}
            disabled={Boolean(paymentData || (!user && (!email || Boolean(emailEditable))))}
            onCheckedChange={(state) => {
              setBillingAddressSameAsShipping(state as boolean);
            }}
          />
          <Label htmlFor="shippingTheSameAsBilling">Shipping is the same as billing</Label>
        </div>

        {!billingAddressSameAsShipping && (
          <>
            {shippingAddress ? (
              <div>
                <AddressItem
                  actions={
                    <Button
                      variant={"outline"}
                      disabled={Boolean(paymentData)}
                      onClick={(e) => {
                        e.preventDefault();
                        setShippingAddress(undefined);
                      }}
                    >
                      Remove
                    </Button>
                  }
                  address={shippingAddress}
                  addressType="shipping"
                />
              </div>
            ) : user ? (
              <CheckoutAddresses
                heading="Shipping address"
                description="Please select a shipping address."
                setAddress={setShippingAddress}
                addressType="shipping"
              />
            ) : (
              <CreateAddressModal
                callback={(address) => {
                  setShippingAddress(address);
                }}
                disabled={!email || Boolean(emailEditable)}
                skipSubmission={true}
                addressType="shipping"
              />
            )}
          </>
        )}

        {shippingOptions && shippingOptions.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-medium text-3xl">Shipping</h2>
            {shippingOptions.map((option) => (
              <button
                key={option.serviceName}
                type="button"
                disabled={Boolean(paymentData)}
                onClick={() => setSelectedShipping(option.serviceName)}
                className={`w-full flex items-center justify-between px-4 py-3.5 border text-left ${
                  selectedShipping === option.serviceName
                    ? "border-primary/60 bg-primary/[0.03]"
                    : "border-border/50"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`size-3.5 rounded-full border flex items-center justify-center ${
                      selectedShipping === option.serviceName
                        ? "border-primary"
                        : "border-border"
                    }`}
                  >
                    {selectedShipping === option.serviceName && (
                      <div className="size-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest font-medium">
                      {option.serviceName}
                    </div>
                    <div className="text-xs text-primary/40 mt-0.5">
                      {option.timeframe}
                    </div>
                  </div>
                </div>
                <Price amount={option.cost * 100} />
              </button>
            ))}
          </div>
        )}

        {!paymentData && !isConfirmingOrder && (
          <Button
            className="self-start"
            disabled={!canGoToPayment || (shippingOptions && shippingOptions.length > 0 && !selectedShipping)}
            onClick={(e) => {
              e.preventDefault();
              if (bankTransfer) {
                handleConfirmOrder();
              } else {
                void initiatePaymentIntent("stripe");
              }
            }}
          >
            {bankTransfer ? "Confirm order" : "Go to payment"}
          </Button>
        )}

        {isConfirmingOrder && (
          <div className="flex items-center gap-3 text-primary/70">
            <LoadingSpinner className="w-5 h-5" />
            <span>Creating your order…</span>
          </div>
        )}

        {!paymentData?.["clientSecret"] && error && (
          <div className="my-8">
            <Message error={error} />

            <Button
              onClick={(e) => {
                e.preventDefault();
                refresh();
              }}
              variant="default"
            >
              Try again
            </Button>
          </div>
        )}

        <Suspense fallback={<React.Fragment />}>
          {/* @ts-ignore */}
          {paymentData && paymentData?.["clientSecret"] && (
            <div className="pb-16">
              <h2 className="font-medium text-3xl">Payment</h2>
              {error && <p>{`Error: ${error}`}</p>}
              <Elements
                options={{
                  appearance: {
                    theme: "stripe",
                    variables: {
                      borderRadius: "6px",
                      colorPrimary: "#858585",
                      gridColumnSpacing: "20px",
                      gridRowSpacing: "20px",
                      colorBackground: cssVariables.colors.base0,
                      colorDanger: cssVariables.colors.error500,
                      colorDangerText: cssVariables.colors.error500,
                      colorIcon: cssVariables.colors.base1000,
                      colorText: cssVariables.colors.base1000,
                      colorTextPlaceholder: "#858585",
                      fontFamily: "Geist, sans-serif",
                      fontSizeBase: "16px",
                      fontWeightBold: "600",
                      fontWeightNormal: "500",
                      spacingUnit: "4px",
                    },
                  },
                  clientSecret: paymentData["clientSecret"] as string,
                }}
                stripe={stripe}
              >
                <div className="flex flex-col gap-8">
                  <CheckoutForm
                    customerEmail={email}
                    billingAddress={billingAddress}
                    setProcessingPayment={setProcessingPayment}
                  />
                  <Button
                    variant="ghost"
                    className="self-start"
                    onClick={() => setPaymentData(null)}
                  >
                    Cancel payment
                  </Button>
                </div>
              </Elements>
            </div>
          )}
        </Suspense>
      </div>

      {!cartIsEmpty && (
        <div className="basis-full lg:basis-1/3 lg:pl-8 p-8 border-none bg-primary/5 flex flex-col gap-8 rounded-lg">
          <h2 className="text-3xl font-medium">Your cart</h2>
          {cart?.items?.map((item, index) => {
            if (typeof item.product === "object" && item.product) {
              const {
                product,
                product: { id: _id, featuredImage, meta, title, gallery },
                quantity,
                variant,
              } = item;

              if (!quantity) return null;

              const galleryImage =
                gallery?.[0]?.image && typeof gallery[0].image === "object"
                  ? gallery[0].image
                  : undefined;

              const metaImage =
                meta?.image && typeof meta.image === "object"
                  ? meta.image
                  : undefined;

              const featuredImageObject =
                featuredImage && typeof featuredImage === "object"
                  ? featuredImage
                  : undefined;

              let image = galleryImage || metaImage || featuredImageObject;
              let price = product?.priceInAUD;

              const isVariant = Boolean(variant) && typeof variant === "object";

              if (isVariant) {
                price = variant?.priceInAUD;

                const imageVariant = product.gallery?.find((item: any) => {
                  if (!item.variantOption) return false;
                  const variantOptionID =
                    typeof item.variantOption === "object"
                      ? item.variantOption.id
                      : item.variantOption;

                  const hasMatch = variant?.options?.some((option: any) => {
                    if (typeof option === "object") return option.id === variantOptionID;
                    else return option === variantOptionID;
                  });

                  return hasMatch;
                });

              if (imageVariant && typeof imageVariant.image === "object") {
                image = imageVariant.image;
              }
              }

              return (
                <div className="flex items-start gap-4" key={item.id || index}>

                    {image && typeof image !== "string" && (
                      <Media className="relative *:object-contain size-32" fill imgClassName="rounded-lg" resource={image} />
                    )}

                  <div className="flex flex-col grow justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-lg">{title}</p>
                      {variant && typeof variant === "object" && (
                        <p className="text-sm font-mono text-primary/50 tracking-widest">
                          {(variant.options as any[])
                            ?.map((option: any) => {
                              if (typeof option === "object") return option.label;
                              return null;
                            })
                            .join(", ")}
                        </p>
                      )}
                      <div>
                        {"x"}
                        {quantity}
                      </div>
                    </div>

                    {typeof price === "number" && <Price amount={price} />}
                  </div>
                </div>
              );
            }
            return null;
          })}
          <hr />
          <div className="flex justify-between items-center gap-2">
            <span className="uppercase">Subtotal</span>{" "}
            <Price className="text-xl" amount={cart.subtotal || 0} />
          </div>
          {shippingCost > 0 && (
            <div className="flex justify-between items-center gap-2">
              <span className="uppercase">Shipping</span>{" "}
              <Price className="text-xl" amount={shippingCost} />
            </div>
          )}
          <hr />
          <div className="flex justify-between items-center gap-2">
            <span className="uppercase font-medium">Total</span>{" "}
            <Price className="text-3xl font-medium" amount={totalWithShipping} />
          </div>
          {bankTransfer && (
            <div className="bg-card border rounded-lg p-4 text-sm space-y-1.5">
              <h4 className="font-semibold text-base">{bankTransfer.heading || "Bank Transfer"}</h4>
              <p className="text-primary/70">
                {bankTransfer.note ||
                  "Your order will be shipped once your bank transfer is confirmed. Please transfer the total amount to the account below:"}
              </p>
              <dl className="mt-2 space-y-1 [&_dd]:mb-1.5">
                {bankTransfer.bankName && (
                  <>
                    <dt className="font-medium">Bank:</dt>
                    <dd>{bankTransfer.bankName}</dd>
                  </>
                )}
                {bankTransfer.accountName && (
                  <>
                    <dt className="font-medium">Account Name:</dt>
                    <dd>{bankTransfer.accountName}</dd>
                  </>
                )}
                {bankTransfer.accountNumber && (
                  <>
                    <dt className="font-medium">Account Number:</dt>
                    <dd>{bankTransfer.accountNumber}</dd>
                  </>
                )}
                {bankTransfer.routingNumber && (
                  <>
                    <dt className="font-medium">Routing / Sort Code / BSB:</dt>
                    <dd>{bankTransfer.routingNumber}</dd>
                  </>
                )}
                {bankTransfer.swiftCode && (
                  <>
                    <dt className="font-medium">SWIFT / BIC:</dt>
                    <dd>{bankTransfer.swiftCode}</dd>
                  </>
                )}
              </dl>
              {bankTransfer.bankTransferFooter && (
                <p className="text-xs text-primary/50 mt-2">{bankTransfer.bankTransferFooter}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
