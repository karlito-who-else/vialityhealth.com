"use client";

import { Link } from "@/components/atoms/Link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Image from "next/image";

import type { Product } from "@/payload-types";

export type FeaturedProductsSectionProps = {
  heading: string;
  shopAllLabel?: string | null;
  products: Product[];
};

export function FeaturedProductsSection({
  heading,
  shopAllLabel,
  products,
}: FeaturedProductsSectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <section className="py-24 px-6 bg-surface-warm" data-component="FeaturedProductsSection">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-end mb-8">
            <h2 className="font-serif uppercase font-light text-4xl text-primary">{heading}</h2>
            {shopAllLabel && (
              <Link
                href="/shop"
                className="text-xs uppercase tracking-widest hidden md:inline-block border-b border-transparent hover:border-primary/30 pb-1 transition-colors"
              >
                {shopAllLabel}
              </Link>
            )}
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <m.article
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer md:last:hidden"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="aspect-3/4 mb-6 bg-surface-placeholder relative overflow-hidden flex items-center justify-center">
                    {product.featuredImage && typeof product.featuredImage === "object" ? (
                      <Image
                        src={product.featuredImage.url || ""}
                        alt={product.featuredImage.alt || product.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        fill
                      />
                    ) : (
                      <div className="text-primary/20 font-serif uppercase font-light text-6xl tracking-wider">
                        v
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <h3 className="uppercase tracking-widest text-xs font-medium">
                        {product.title}
                      </h3>
                      {(() => {
                        const productPrice = product.priceInAUD;
                        const variantPrices = product.variants?.docs?.flatMap((v) =>
                          typeof v === "object" && v && typeof v.priceInAUD === "number"
                            ? [v.priceInAUD]
                            : [],
                        ) ?? [];
                        const price = typeof productPrice === "number" ? productPrice : Math.min(...variantPrices);
                        const showPrice = typeof productPrice === "number" || variantPrices.length > 0;
                        return showPrice ? (
                          <span className="text-sm font-light">${(price / 100).toFixed(2)}</span>
                        ) : null;
                      })()}
                    </div>
                    <p className="text-primary/55 text-sm">{product.meta?.description || ""}</p>
                  </div>
                </Link>
              </m.article>
            ))}
          </div>

          {shopAllLabel && (
            <div className="mt-12 text-center md:hidden">
              <Link
                href="/shop"
                className="inline-block border-b border-primary/30 pb-1 text-xs uppercase tracking-widest"
              >
                {shopAllLabel}
              </Link>
            </div>
          )}
        </div>
      </section>
    </LazyMotion>
  );
}
