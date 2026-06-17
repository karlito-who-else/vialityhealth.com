"use client";

import { createBankTransferOrder } from "@/actions/createBankTransferOrder";
import { createTagadaPayCheckout } from "@/actions/createTagadaPayCheckout";
import { AddressItem } from "@/components/addresses/AddressItem";
import { CreateAddressModal } from "@/components/addresses/CreateAddressModal";
import { Link } from "@/components/atoms/Link";
import { BankTransferInfo } from "@/components/BankTransferInfo";
import { BankfulForm } from "@/components/checkout/BankfulForm";
import { CheckoutAddresses } from "@/components/checkout/CheckoutAddresses";
import { CheckoutForm } from "@/components/forms/CheckoutForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Media } from "@/components/Media";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cssVariables } from "@/cssVariables";
import { Address } from "@/payload-types";
import { useAuth } from "@/providers/Auth";
import { env } from "@/utilities/env";
import { useAddresses, useCart, usePayments } from "@payloadcms/plugin-ecommerce/client/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import React, { startTransition, Suspense, useCallback, useEffect, useOptimistic, useState } from "react";
import { toast } from "sonner";

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

export const CheckoutPage: React.FC<{ bankTransfer?: BankTransferInfo; shippingOptions?: ShippingOption[]; tagadaPayEnabled?: boolean; bankfulEnabled?: boolean }> = ({ bankTransfer, shippingOptions, tagadaPayEnabled, bankfulEnabled }) => {
  const { user } = useAuth();
  const { push, refresh } = useRouter();
  const { cart, clearCart, decrementItem, incrementItem } = useCart();

  type OptimisticAction =
    | { type: "decrement_item"; id: string }
    | { type: "increment_item"; id: string };

  const [optimisticCart, addOptimisticUpdate] = useOptimistic(
    cart,
    (state, action: OptimisticAction) => {
      if (!state?.items) return state;
      switch (action.type) {
        case "decrement_item": {
          return {
            ...state,
            items: state.items.map((item) =>
              item.id === action.id
                ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
                : item,
            ),
          };
        }
        case "increment_item": {
          return {
            ...state,
            items: state.items.map((item) =>
              item.id === action.id
                ? { ...item, quantity: (item.quantity || 0) + 1 }
                : item,
            ),
          };
        }
        default:
          return state;
      }
    },
  );

  const handleDecrementItem = useCallback(
    (itemId: string) => {
      startTransition(async () => {
        addOptimisticUpdate({ type: "decrement_item", id: itemId });
        await decrementItem(itemId);
      });
    },
    [addOptimisticUpdate, decrementItem],
  );

  const handleIncrementItem = useCallback(
    (itemId: string) => {
      startTransition(async () => {
        addOptimisticUpdate({ type: "increment_item", id: itemId });
        await incrementItem(itemId);
      });
    },
    [addOptimisticUpdate, incrementItem],
  );

  const [error, setError] = useState<null | string>(null);
  const [email, setEmail] = useState("");
  const [emailEditable, setEmailEditable] = useState(true);
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null);
  const { confirmOrder, initiatePayment } = usePayments();
  const { addresses } = useAddresses();
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>();
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>();
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true);
  const [isProcessingPayment, setProcessingPayment] = useState(false);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [isProcessingTagadaPay, setIsProcessingTagadaPay] = useState(false);
  const [isProcessingBankful, setIsProcessingBankful] = useState(false);
  const [showBankfulForm, setShowBankfulForm] = useState(false);
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

  const handleTagadaPayCheckout = useCallback(async () => {
    if (!cart || !cart.items) return;

    setIsProcessingTagadaPay(true);

    try {
      const tagadaPayItems = cart.items
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .map((item) => {
          const variant = item.variant;
          const tagadaPayVariantId =
            variant && typeof variant === "object"
              ? (variant as any).tagadaPayVariantId
              : undefined;

          if (!tagadaPayVariantId) {
            throw new Error(
              "One or more items in your cart are not configured for TagadaPay checkout. Please configure the TagadaPay Variant ID in the product settings.",
            );
          }

          return {
            tagadaPayVariantId,
            quantity: item.quantity || 1,
          };
        });

      const result = await createTagadaPayCheckout({
        items: tagadaPayItems,
        cartId: cart.id as number | undefined,
        customerEmail: email || user?.email,
      });

      if (result?.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Something went wrong.";
      setError(msg);
      toast.error(msg);
      setIsProcessingTagadaPay(false);
    }
  }, [cart, email, user]);

  const handleBankfulPayment = useCallback(
    async (cardDetails: { cardNumber: string; cardExpiry: string; cardCvv: string; firstName?: string; lastName?: string }) => {
      if (!cart || !cart.items || !canGoToPayment) return;

      setIsProcessingBankful(true);
      setError(null);

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
          cardData: cardDetails,
        };

        const result = (await initiatePayment("bankful", {
          additionalData: pmData,
        })) as Record<string, unknown>;

        if (result?.message) {
          const confirmResult = (await confirmOrder("bankful", {
            additionalData: {
              transactionId: result.transactionId,
              ...(email ? { customerEmail: email } : {}),
            },
          })) as Record<string, unknown>;

          if (confirmResult && confirmResult.orderID) {
            const queryParams = new URLSearchParams();
            if (email) {
              queryParams.set("email", email);
            }
            if (confirmResult.accessToken) {
              queryParams.set("accessToken", confirmResult.accessToken as string);
            }

            const queryString = queryParams.toString();
            const redirectUrl = `/checkout/order-confirmed/${confirmResult.orderID}${queryString ? `?${queryString}` : ""}`;

            clearCart();
            push(redirectUrl);
          }
        }
      } catch (error) {
        const errorData = error instanceof Error ? (() => { try { return JSON.parse(error.message); } catch { return {}; } })() : {};
        let errorMessage = error instanceof Error ? error.message : "An error occurred while processing payment.";

        if (errorData?.cause?.code === "OutOfStock") {
          errorMessage = "One or more items in your cart are out of stock.";
        }

        setError(errorMessage);
        toast.error(errorMessage);
        setIsProcessingBankful(false);
      }
    },
    [billingAddress, billingAddressSameAsShipping, email, shippingAddress, selectedShipping, shippingOptions, cart, canGoToPayment, user, clearCart, push, initiatePayment, confirmOrder],
  );

  if (!bankTransfer && !stripe && !tagadaPayEnabled && !bankfulEnabled) return null;

  if (cartIsEmpty && (isProcessingPayment || isProcessingTagadaPay)) {
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
    <div className="min-h-screen lg:grid lg:grid-cols-2 w-full">
      {/* ── Left sidebar — Order summary (desktop) ── */}
      <div className="hidden lg:flex flex-col bg-primary text-primary-foreground sticky top-0 h-screen">
        <div className="flex-1 mx-auto w-full max-w-[480px] px-12 pt-16 pb-16 flex flex-col">
          <Link className="mb-14 block" href="/shop">
            <img
              alt="Logo"
              width="140"
              height="140"
              className="h-[130px] w-auto opacity-90"
              src="/AussiePeptides-Logo-white.png"
            />
          </Link>

          <div className="space-y-5 mb-8">
            {optimisticCart?.items?.map((item, index) => {
              if (typeof item.product !== "object" || !item.product) return null;
              if (!item.quantity) return null;

              const { product, quantity, variant } = item;
              const { title, gallery, featuredImage, meta } = product;

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
                const imageVariant = product.gallery?.find((g: any) => {
                  if (!g.variantOption) return false;
                  const variantOptionID =
                    typeof g.variantOption === "object"
                      ? g.variantOption.id
                      : g.variantOption;
                  const hasMatch = variant?.options?.some((o: any) => {
                    if (typeof o === "object") return o.id === variantOptionID;
                    return o === variantOptionID;
                  });
                  return hasMatch;
                });
                if (imageVariant && typeof imageVariant.image === "object") {
                  image = imageVariant.image;
                }
              }

              return (
                <div className="flex items-center gap-4" key={item.id || index}>
                  <div className="relative shrink-0">
                    {image && typeof image !== "string" && (
                      <Media
                        className="w-13 h-13 rounded-lg object-contain bg-primary-foreground/10"
                        fill
                        imgClassName="rounded-lg"
                        resource={image}
                      />
                    )}
                  </div>
                  <span className="text-primary-foreground/70 text-sm flex-1 leading-snug">{title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-primary-foreground/10 rounded-lg overflow-hidden">
                      <button
                        disabled={!item.id}
                        onClick={(e) => { e.preventDefault(); if (item.id) handleDecrementItem(item.id); }}
                        className="w-6 h-6 flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        type="button"
                        aria-label="Decrease quantity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-primary-foreground tabular-nums">{quantity}</span>
                      <button
                        disabled={!item.id}
                        onClick={(e) => { e.preventDefault(); if (item.id) handleIncrementItem(item.id); }}
                        className="w-6 h-6 flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        type="button"
                        aria-label="Increase quantity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    </div>
                    <div className="flex w-20 flex-col items-end text-right">
                      <span className="text-primary-foreground font-semibold text-sm">
                        {typeof price === "number" ? `$${(price / 100).toFixed(2)}` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link className="inline-flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors mb-8" href="/shop">
            <span className="text-lg leading-none">+</span> Add more items
          </Link>

          <div className="border-t border-primary-foreground/15 pt-5 space-y-2.5 mb-6">
            <div className="flex justify-between text-sm text-primary-foreground/50">
              <span>Subtotal</span>
              <span>${(cart?.subtotal ? cart.subtotal / 100 : 0).toFixed(2)}</span>
            </div>
            {shippingCost > 0 && (
              <div className="flex justify-between text-sm text-primary-foreground/50">
                <span>Shipping</span>
                <span>${(shippingCost / 100).toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-primary-foreground/15 pt-6">
            <p className="text-primary-foreground/50 text-xs uppercase tracking-widest mb-2">Total due</p>
            <p className="text-primary-foreground font-semibold text-5xl tracking-tight">
              ${(totalWithShipping / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Right side — Checkout form ── */}
      <div className="bg-background flex flex-col">
        {/* Mobile header */}
        <div className="block lg:hidden bg-primary text-primary-foreground">
          <div className="px-5 pt-6 pb-5">
            <div className="flex items-center justify-between mb-8">
              <Link href="/shop">
                <img
                  alt="Logo"
                  width="120"
                  height="120"
                  className="h-14 w-auto opacity-90"
                  src="/AussiePeptides-Logo-white.png"
                />
              </Link>
            </div>
            <div className="space-y-3 mb-5">
              {optimisticCart?.items?.map((item, index) => {
                if (typeof item.product !== "object" || !item.product) return null;
                if (!item.quantity) return null;

                const { product, quantity } = item;
                const { title, gallery, featuredImage, meta } = product;

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

                const isVariant = Boolean(item.variant) && typeof item.variant === "object";

                if (isVariant) {
                  price = item.variant?.priceInAUD;
                }

                return (
                  <div className="flex items-center gap-3" key={item.id || index}>
                    <div className="relative shrink-0">
                      {image && typeof image !== "string" && (
                        <Media
                          className="w-12 h-12 rounded-lg object-contain bg-primary-foreground/10"
                          fill
                          imgClassName="rounded-lg"
                          resource={image}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-primary-foreground/90 text-sm">
                        {title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-primary-foreground/10 rounded-lg overflow-hidden">
                        <button
                          disabled={!item.id}
                          onClick={(e) => { e.preventDefault(); if (item.id) handleDecrementItem(item.id); }}
                          className="w-5 h-5 flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          type="button"
                          aria-label="Decrease quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-primary-foreground tabular-nums">{quantity}</span>
                        <button
                          disabled={!item.id}
                          onClick={(e) => { e.preventDefault(); if (item.id) handleIncrementItem(item.id); }}
                          className="w-5 h-5 flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          type="button"
                          aria-label="Increase quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                      </div>
                      <span className="text-primary-foreground font-semibold text-xs">
                        {typeof price === "number" ? `$${(price / 100).toFixed(2)}` : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link className="inline-flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors mb-2" href="/shop">
              <span className="text-lg leading-none">+</span> Add more items
            </Link>
          </div>
        </div>

        {/* Mobile sticky total bar */}
        <div className="block lg:hidden sticky top-0 z-30 bg-primary text-primary-foreground border-t border-primary-foreground/20 shadow-lg shadow-black/20">
          <div className="px-5 pt-5 pb-7">
            <p className="text-primary-foreground/60 text-xs uppercase tracking-widest mb-1">Total due</p>
            <p className="text-primary-foreground font-extrabold text-4xl">
              ${(totalWithShipping / 100).toFixed(2)}
            </p>
          </div>
        </div>

        {/* ── Form content ── */}
        <div className="flex-1 max-w-md mx-auto w-full lg:max-w-[760px] px-5 lg:px-12 py-8 lg:pt-16 lg:pb-16">
          <div className="space-y-10">
            {/* ── Contact ── */}
            <section>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  {user ? (
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-accent px-4 py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{user.email}</p>
                      </div>
                      <Link className="text-xs font-medium text-primary hover:underline shrink-0" href="/logout">
                        Log out
                      </Link>
                    </div>
                  ) : !emailEditable && email ? (
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-accent px-4 py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      <p className="text-sm text-foreground flex-1">{email}</p>
                      <button
                        className="text-xs font-medium text-primary hover:underline shrink-0 bg-transparent border-0 p-0 cursor-pointer"
                        onClick={() => { setEmail(""); setEmailEditable(true); }}
                        type="button"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                      <input
                        required
                        placeholder="email@example.com"
                        className="w-full bg-primary-foreground border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!emailEditable}
                      />
                      <div className="mt-3 flex items-center gap-3">
                        <Button
                          disabled={!email || !emailEditable}
                          onClick={(e) => { e.preventDefault(); setEmailEditable(false); }}
                          variant="default"
                        >
                          Continue as guest
                        </Button>
                        <Link className="text-xs font-medium text-primary hover:underline" href="/login">
                          Log in
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── Delivery Details ── */}
            <section className="scroll-mt-24">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Delivery Details</h2>

              {billingAddress ? (
                <div className="mb-4 p-4 border border-muted">
                  <AddressItem
                    actions={
                      <Button
                        variant="outline"
                        disabled={Boolean(paymentData)}
                        onClick={(e) => { e.preventDefault(); setBillingAddress(undefined); }}
                      >
                        Change
                      </Button>
                    }
                    address={billingAddress}
                    addressType="billing"
                  />
                </div>
              ) : user ? (
                <div className="mb-4">
                  <CheckoutAddresses heading="Billing address" setAddress={setBillingAddress} addressType="billing" />
                </div>
              ) : (
                <CreateAddressModal
                  disabled={!email || Boolean(emailEditable)}
                  callback={(address) => { setBillingAddress(address); }}
                  skipSubmission={true}
                  addressType="billing"
                />
              )}

              <div className="flex items-center gap-3 mt-4 mb-4">
                <Checkbox
                  id="shippingTheSameAsBilling"
                  checked={billingAddressSameAsShipping}
                  disabled={Boolean(paymentData || (!user && (!email || Boolean(emailEditable))))}
                  onCheckedChange={(state) => {
                    setBillingAddressSameAsShipping(state as boolean);
                  }}
                />
                <Label htmlFor="shippingTheSameAsBilling">
                  Shipping is the same as billing
                </Label>
              </div>

              {!billingAddressSameAsShipping && (
                <>
                  {shippingAddress ? (
                    <div className="mb-4">
                      <AddressItem
                        actions={
                          <Button
                            variant="outline"
                            disabled={Boolean(paymentData)}
                            onClick={(e) => { e.preventDefault(); setShippingAddress(undefined); }}
                          >
                            Change
                          </Button>
                        }
                        address={shippingAddress}
                        addressType="shipping"
                      />
                    </div>
                  ) : user ? (
                    <div className="mb-4">
                      <CheckoutAddresses
                        heading="Shipping address"
                        description="Please select a shipping address."
                        setAddress={setShippingAddress}
                        addressType="shipping"
                      />
                    </div>
                  ) : (
                    <CreateAddressModal
                      callback={(address) => { setShippingAddress(address); }}
                      disabled={!email || Boolean(emailEditable)}
                      skipSubmission={true}
                      addressType="shipping"
                    />
                  )}
                </>
              )}
            </section>

            {/* ── Shipping Method ── */}
            {shippingOptions && shippingOptions.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Shipping Method</h2>
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.serviceName}
                      className={`flex items-center justify-between gap-4 border border-muted rounded-xl px-4 py-3.5 cursor-pointer transition-colors ${
                        selectedShipping === option.serviceName
                          ? "border-primary bg-primary/[0.03]"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          className="accent-primary"
                          type="radio"
                          value={option.serviceName}
                          checked={selectedShipping === option.serviceName}
                          onChange={() => setSelectedShipping(option.serviceName)}
                          disabled={Boolean(paymentData)}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                            <span className="font-medium text-sm text-foreground">
                              {option.serviceName}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{option.timeframe}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-sm shrink-0">
                        ${(option.cost * 100 / 100).toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-3 text-right">
                  <Link className="text-xs font-medium text-primary transition-colors hover:text-primary/70" href="/shop">
                    + Add more items
                  </Link>
                </div>
              </section>
            )}

            {/* ── Payment ── */}
            <section>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Payment</h2>

              {/* Payment method selection */}
              <div className="space-y-3 mb-6">
                {bankTransfer && (
                  <label className={`flex items-start gap-3 border border-muted rounded-xl px-4 py-4 cursor-pointer transition-colors ${
                    "bg-primary/[0.03]"
                  }`}>
                    <input className="accent-primary mt-0.5 shrink-0" type="radio" checked name="paymentMethod" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                          <span className="font-semibold text-sm text-foreground">Bank Transfer</span>
                        </div>
                        <span className="bg-success/20 text-success text-[11px] font-bold px-2 py-0.5 rounded-full">Fee additional fee</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Transfer the exact amount to our bank account. Details are prodived below and will be emailed to you after checkout.
                      </p>
                    </div>
                  </label>
                )}

                {bankfulEnabled && (
                  <label className={`flex items-start gap-3 border border-muted rounded-xl px-4 py-4 cursor-pointer transition-colors border-border hover:border-primary/30`}>
                    <input className="accent-primary mt-0.5 shrink-0" type="radio" name="paymentMethod" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                        <span className="font-semibold text-sm text-foreground">Credit / Debit Card</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Pay securely with your credit or debit card.
                      </p>
                    </div>
                  </label>
                )}

                {tagadaPayEnabled && (
                  <label className="flex items-start gap-3 border border-muted rounded-xl px-4 py-4 cursor-pointer transition-colors border-border hover:border-primary/30">
                    <input className="accent-primary mt-0.5 shrink-0" type="radio" name="paymentMethod" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        <span className="font-semibold text-sm text-foreground">TagadaPay</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Pay securely with TagadaPay hosted checkout.
                      </p>
                    </div>
                  </label>
                )}

                {!tagadaPayEnabled && !bankTransfer && !bankfulEnabled && stripe && (
                  <label className="flex items-start gap-3 border border-muted rounded-xl px-4 py-4 cursor-pointer transition-colors border-border hover:border-primary/30">
                    <input className="accent-primary mt-0.5 shrink-0" type="radio" checked name="paymentMethod" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">Credit Card (Stripe)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Pay securely with Stripe.
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {/* Action buttons */}
              {!paymentData && !isConfirmingOrder && !isProcessingBankful && (
                <div className="flex flex-col gap-3">
                  {bankTransfer && (
                    <button
                      disabled={!canGoToPayment || (shippingOptions && shippingOptions.length > 0 && !selectedShipping)}
                      onClick={(e) => { e.preventDefault(); handleConfirmOrder(); }}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed font-bold py-4 rounded-xl transition-colors text-base"
                    >
                      {isConfirmingOrder ? "Creating your order…" : "Confirm order (Bank Transfer)"}
                    </button>
                  )}
                  {bankfulEnabled && !showBankfulForm && (
                    <button
                      disabled={!canGoToPayment || (shippingOptions && shippingOptions.length > 0 && !selectedShipping)}
                      onClick={(e) => { e.preventDefault(); setShowBankfulForm(true); }}
                      className={`w-full font-bold py-4 rounded-xl transition-colors text-base ${
                        bankTransfer || tagadaPayEnabled
                          ? "bg-primary-foreground border-2 text-primary hover:bg-accent"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      Pay with Card
                    </button>
                  )}
                  {tagadaPayEnabled && (
                    <button
                      disabled={isProcessingTagadaPay || (!email && !user)}
                      onClick={(e) => { e.preventDefault(); void handleTagadaPayCheckout(); }}
                      className={`w-full font-bold py-4 rounded-xl transition-colors text-base ${
                        bankTransfer || bankfulEnabled
                          ? "bg-primary-foreground border-2 text-primary hover:bg-accent"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {isProcessingTagadaPay ? "Redirecting…" : "Pay with TagadaPay"}
                    </button>
                  )}
                  {!tagadaPayEnabled && !bankTransfer && !bankfulEnabled && (
                    <button
                      disabled={!canGoToPayment || (shippingOptions && shippingOptions.length > 0 && !selectedShipping)}
                      onClick={(e) => { e.preventDefault(); void initiatePaymentIntent("stripe"); }}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed font-bold py-4 rounded-xl transition-colors text-base"
                    >
                      Go to payment
                    </button>
                  )}
                </div>
              )}

              {showBankfulForm && (
                <div>
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Card Payment</h2>
                  <BankfulForm
                    onCardDetails={(cardDetails) => { void handleBankfulPayment(cardDetails); }}
                    isProcessing={isProcessingBankful}
                    error={error}
                  />
                </div>
              )}

              {(isConfirmingOrder || isProcessingTagadaPay || isProcessingBankful) && (
                <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
                  <LoadingSpinner className="w-5 h-5" />
                  <span>
                    {isProcessingTagadaPay
                      ? "Redirecting to TagadaPay…"
                      : isProcessingBankful
                      ? "Processing your payment…"
                      : "Creating your order…"}
                  </span>
                </div>
              )}

              {!paymentData?.["clientSecret"] && error && (
                <div className="my-6">
                  <div className="rounded-xl border border-error bg-error/10 px-4 py-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                  <Button
                    onClick={(e) => { e.preventDefault(); refresh(); }}
                    variant="default"
                    className="mt-3"
                  >
                    Try again
                  </Button>
                </div>
              )}

              <Suspense fallback={<React.Fragment />}>
                {/* @ts-ignore */}
                {paymentData && paymentData?.["clientSecret"] && (
                  <div className="mt-6">
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Complete Payment</h2>
                    {error && (
                      <div className="rounded-xl border border-error bg-error/10 px-4 py-3 mb-4">
                        <p className="text-sm text-destructive">{`Error: ${error}`}</p>
                      </div>
                    )}
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
                      <div className="flex flex-col gap-4">
                        <CheckoutForm
                          customerEmail={email}
                          billingAddress={billingAddress}
                          setProcessingPayment={setProcessingPayment}
                        />
                        <Button
                          variant="ghost"
                          onClick={() => setPaymentData(null)}
                        >
                          Cancel payment
                        </Button>
                      </div>
                    </Elements>
                  </div>
                )}
              </Suspense>

              {/* ── Order totals (shown inside form in mobile, and in sidebar on desktop) ── */}
              {/* <div className="mt-10 border-t border-border pt-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Subtotal</span>
              <span>${(optimisticCart?.subtotal ? optimisticCart.subtotal / 100 : 0).toFixed(2)}</span>
                </div>
                {shippingCost > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Shipping</span>
                    <span>${(shippingCost / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total due</p>
                  <p className="text-foreground font-bold text-3xl tracking-tight">
                    ${(totalWithShipping / 100).toFixed(2)}
                  </p>
                </div>
              </div> */}

              {bankTransfer && (
                <div className="mt-8">
                  <BankTransferInfo settings={bankTransfer} amount={totalWithShipping} />
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
