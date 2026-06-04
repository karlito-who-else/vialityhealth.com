"use client";

import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";

import { AddToCart } from "@/components/Cart/AddToCart";
import { RichText } from "@/components/RichText";
import type { Faq, Ingredient, Product, Setting, TrustBadge, Variant } from "@/payload-types";
import { cn } from "@/utilities/cn";

type IngredientItem = {
  ingredient: Ingredient;
  quantity: string;
  id?: string | null;
};

export function VialityProductDescription({
  product,
  faqs,
  ingredients,
  trustBadges,
  productContent,
}: {
  product: Product;
  faqs: Faq[];
  ingredients: IngredientItem[];
  trustBadges: TrustBadge[];
  productContent: Setting;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);

  const oneTimePrice = product.priceInAUD || 88;
  const discountPercent = productContent?.subscribeDiscountPercent ?? 15;
  const subPrice = Math.round(oneTimePrice * (1 - discountPercent / 100));
  const displayPrice = isSubscription ? subPrice : oneTimePrice;

  const collectionLabel = productContent?.collectionLabel || "viality — Flagship Collection";
  const supplyLabel = productContent?.supplyLabel || "60 Capsules · 30-Day Supply";
  const purchaseOptionLabel = productContent?.purchaseOptionLabel || "Purchase Option";
  const subscribeLabel = productContent?.subscribeLabel || `Subscribe & Save ${discountPercent}%`;
  const subscribeDetail =
    productContent?.subscribeDetail || "Delivered every 30 days. Cancel anytime.";
  const oneTimeLabel = productContent?.oneTimeLabel || "One-Time Purchase";
  const quantityLabel = productContent?.quantityLabel || "Quantity";
  const buyNowLabel = productContent?.buyNowLabel || "Buy Now";
  const shippingText = productContent?.shippingText || "";
  const ingredientsHeading = product.ingredientsHeading || "Full formulation breakdown";
  const otherIngredientsText = product.otherIngredientsText || "";
  const faqLabel = productContent?.faqLabel || "Questions";
  const faqHeading = productContent?.faqHeading || "Everything you need to know.";

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="p-8 xl:p-12 flex flex-col gap-8 mt-8 md:mt-0"
      >
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary/35 mb-3">{collectionLabel}</p>
        <h1 className="font-serif text-4xl xl:text-5xl text-primary leading-tight mb-2">
          {product.title}
        </h1>
        <p className="text-xs uppercase tracking-widest text-primary/40 mb-5">{supplyLabel}</p>
        <div className="text-sm text-primary/60 font-light leading-[1.8] max-w-sm">
          {product.description ? (
            <RichText data={product.description} />
          ) : (
            "Modern rituals for internal balance. A quietly precise daily formula — designed for consistency, and held to a standard most wellness products never meet."
          )}
        </div>
      </div>

      {/* Subscribe & Save toggle */}
      <div className="space-y-2.5">
        <p className="text-xs uppercase tracking-widest text-primary/35 mb-3">
          {purchaseOptionLabel}
        </p>
        <button
          type="button"
          onClick={() => setIsSubscription(true)}
          className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all duration-200 ${
            isSubscription
              ? "border-primary/60 bg-primary/[0.03]"
              : "border-border/50 hover:border-primary/20"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`size-3.5 rounded-full border flex items-center justify-center transition-colors ${
                isSubscription ? "border-primary" : "border-border"
              }`}
            >
              {isSubscription && <div className="size-1.5 rounded-full bg-primary" />}
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-widest font-medium">{subscribeLabel}</div>
              <div className="text-xs text-primary/40 mt-0.5 tracking-wide">{subscribeDetail}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">${(subPrice / 100).toFixed(2)}</span>
            <span className="text-xs text-primary/35 line-through">${(oneTimePrice / 100).toFixed(2)}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsSubscription(false)}
          className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all duration-200 ${
            !isSubscription
              ? "border-primary/60 bg-primary/[0.03]"
              : "border-border/50 hover:border-primary/20"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`size-3.5 rounded-full border flex items-center justify-center transition-colors ${
                !isSubscription ? "border-primary" : "border-border"
              }`}
            >
              {!isSubscription && <div className="size-1.5 rounded-full bg-primary" />}
            </div>
            <div className="text-xs uppercase tracking-widest font-medium">{oneTimeLabel}</div>
          </div>
          <span className="text-sm font-medium">${(oneTimePrice / 100).toFixed(2)}</span>
        </button>
      </div>

      {/* Quantity + Add to Cart */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-primary/35">{quantityLabel}</p>
        <div className="flex gap-3">
          <div className="flex items-center border border-border/60">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-12 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
            >
              <Minus size={13} />
            </button>
            <span className="w-9 text-center text-sm tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-12 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>

          <AddToCart
            product={product}
            quantity={quantity}
            className="flex-1 h-12 bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/88 active:scale-[0.99] transition-all flex items-center justify-center"
            label={`Add to Cart — ${((displayPrice * quantity) / 100).toFixed(2)}`}
          />
        </div>

        <BuyNow product={product} quantity={quantity} label={buyNowLabel} />
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-3 border-t border-border/40 pt-6">
        {trustBadges.map((badge) => (
          <Badge key={badge.slug} label={badge.label} />
        ))}
      </div>

      {shippingText && <p className="text-xs text-primary/30 leading-relaxed">{shippingText}</p>}

      {/* INGREDIENTS */}
      <div className="border-t border-border/40 pt-6">
        <button
          type="button"
          onClick={() => setIngredientsOpen(!ingredientsOpen)}
          className="w-full grid grid-cols-[1fr_auto] items-center gap-6 py-4 text-left group"
        >
          <span className="font-serif text-xl md:text-2xl text-primary group-hover:text-primary/70 transition-colors">
            {ingredientsHeading}
          </span>
          <m.span
            animate={{ rotate: ingredientsOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-primary/30 group-hover:text-primary/50 transition-colors"
          >
            <ChevronDown size={16} />
          </m.span>
        </button>

        <AnimatePresence>
          {ingredientsOpen && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pb-6 border-t border-border/40 pt-4">
                {ingredients.map((item) => (
                  <div
                    key={item.ingredient.slug}
                    className="flex justify-between items-center py-3 border-b border-border/30"
                  >
                    <span className="text-sm text-primary/70 font-light">{item.ingredient.name}</span>
                    <span className="text-xs text-primary/40 uppercase tracking-widest tabular-nums shrink-0 ml-4">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              {otherIngredientsText && (
                <p className="text-xs text-primary/30 leading-relaxed pb-4">
                  {otherIngredientsText}
                </p>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* FAQ */}
      <div className="border-t border-border/40 pt-6">
        <p className="text-xs uppercase tracking-widest text-primary/35 mb-4">{faqLabel}</p>
        <h2 className="font-serif text-2xl text-primary leading-snug mb-6">{faqHeading}</h2>
        <div>
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.slug}
              q={faq.question}
              a={faq.answer}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </div>
      </m.div>
    </LazyMotion>
  );
}

function BuyNowInner({
  product,
  quantity,
  label,
}: {
  product: Product;
  quantity: number;
  label: string;
}) {
  const { addItem, cart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const variants = product.variants?.docs || [];

  const selectedVariant = useMemo<Variant | undefined>(() => {
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get("variant");
      const validVariant = variants.find((variant) => {
        if (typeof variant === "object") return String(variant.id) === variantId;
        return String(variant) === variantId;
      });
      if (validVariant && typeof validVariant === "object") return validVariant;
    }
    return undefined;
  }, [product.enableVariants, searchParams, variants]);

  const disabled = useMemo<boolean>(() => {
    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === "object" ? item.product?.id : item.product;
      const variantID = item.variant
        ? typeof item.variant === "object" ? item.variant?.id : item.variant
        : undefined;
      if (productID === product.id) {
        if (product.enableVariants) return variantID === selectedVariant?.id;
        return true;
      }
    });
    if (existingItem) {
      const existingQuantity = existingItem.quantity;
      if (product.enableVariants) {
        if (selectedVariant) return existingQuantity >= (selectedVariant.inventory || 0);
        return false;
      }
      return existingQuantity >= (product.inventory || 0);
    }
    if (product.enableVariants) {
      if (selectedVariant && selectedVariant.inventory === 0) return true;
    } else {
      if (product.inventory === 0) return true;
    }
    return false;
  }, [selectedVariant, cart?.items, product]);

  const handleBuyNow = useCallback(() => {
    addItem({ product: product.id, variant: selectedVariant?.id ?? undefined }, quantity);
    router.push("/checkout");
  }, [addItem, product, selectedVariant, quantity, router]);

  return (
    <button
      aria-label={disabled ? "Out of stock" : label}
      disabled={disabled}
      type="button"
      onClick={handleBuyNow}
      className={cn(
        "w-full h-11 border text-xs uppercase tracking-widest transition-colors",
        disabled
          ? "border-border text-muted-foreground cursor-not-allowed"
          : "border-primary/25 text-primary hover:border-primary/50",
      )}
    >
      {disabled ? "Out of Stock" : label}
    </button>
  );
}

function BuyNow(props: { product: Product; quantity: number; label: string }) {
  return (
    <Suspense fallback={<div className="w-full h-11 border border-primary/25" />}>
      <BuyNowInner {...props} />
    </Suspense>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary/45">
      <div className="size-3.5 border border-primary/20 flex items-center justify-center shrink-0">
        <div className="size-1 bg-accent" />
      </div>
      {label}
    </div>
  );
}

function AccordionItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/60">
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-4 flex justify-between items-center text-left gap-6 group"
      >
        <span className="text-xs uppercase tracking-widest font-medium group-hover:text-primary/70 transition-colors">
          {q}
        </span>
        <m.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-primary/35"
        >
          <ChevronDown size={14} />
        </m.span>
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-primary/55 font-light leading-[1.85]">{a}</p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
