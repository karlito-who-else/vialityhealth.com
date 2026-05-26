"use client";

import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useMemo } from "react";
import { toast } from "sonner";

import type { Product, Variant } from "@/payload-types";

type Props = {
  product: Product;
  quantity?: number;
  className?: string;
  label?: string;
};

function AddToCartInner(props: Props) {
  const { product, quantity = 1, className, label } = props;
  const { addItem, cart, isLoading } = useCart();
  const searchParams = useSearchParams();

  const variants = product.variants?.docs || [];

  const selectedVariant = useMemo<Variant | undefined>(() => {
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get("variant");

      const validVariant = variants.find((variant) => {
        if (typeof variant === "object") {
          return String(variant.id) === variantId;
        }
        return String(variant) === variantId;
      });

      if (validVariant && typeof validVariant === "object") {
        return validVariant;
      }
    }

    return undefined;
  }, [product.enableVariants, searchParams, variants]);

  const addToCart = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();

      addItem(
        {
          product: product.id,
          variant: selectedVariant?.id ?? undefined,
        },
        quantity,
      );
      toast.success("Item added to cart.");
    },
    [addItem, product, selectedVariant, quantity],
  );

  const disabled = useMemo<boolean>(() => {
    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === "object" ? item.product?.id : item.product;
      const variantID = item.variant
        ? typeof item.variant === "object"
          ? item.variant?.id
          : item.variant
        : undefined;

      if (productID === product.id) {
        if (product.enableVariants) {
          return variantID === selectedVariant?.id;
        }
        return true;
      }
    });

    if (existingItem) {
      const existingQuantity = existingItem.quantity;

      if (product.enableVariants) {
        if (selectedVariant) {
          return existingQuantity >= (selectedVariant.inventory || 0);
        }
        return false;
      }
      return existingQuantity >= (product.inventory || 0);
    }

    if (product.enableVariants) {
      if (selectedVariant && selectedVariant.inventory === 0) {
        return true;
      }
    } else {
      if (product.inventory === 0) {
        return true;
      }
    }

    return false;
  }, [selectedVariant, cart?.items, product]);

  return (
    <button
      aria-label={disabled ? "Out of stock" : "Add to cart"}
      disabled={disabled || isLoading}
      onClick={addToCart}
      type="submit"
      className={
        className ||
        "w-full h-12 bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/88 active:scale-[0.99] transition-all"
      }
    >
      {disabled ? "Out of Stock" : (label || "Add to Cart")}
    </button>
  );
}

export function AddToCart(props: Props) {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <AddToCartInner {...props} />
    </Suspense>
  );
}
