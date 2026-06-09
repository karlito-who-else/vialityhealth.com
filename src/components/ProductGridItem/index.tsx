import { Link } from "@/components/atoms/Link";
import clsx from "clsx";
import React from "react";

import { Media } from "@/components/Media";
import { Price } from "@/components/Price";
import type { Product } from "@/payload-types";

type Props = {
  product: Partial<Product>;
};

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { featuredImage, gallery, priceInAUD, title } = product;

  let price = priceInAUD;

  const variants = product.variants?.docs;

  if (variants && variants.length > 0) {
    const prices = variants
      .map((v) => (typeof v === "object" && v ? v.priceInAUD : null))
      .filter((p): p is number => typeof p === "number");
    if (prices.length > 0) {
      price = Math.min(...prices);
    }
  }

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== "string"
      ? gallery[0]?.image
      : featuredImage && typeof featuredImage !== "number"
        ? featuredImage
        : false;

  return (
    <Link className="relative inline-block h-full w-full group" href={`/products/${product.slug}`}>
      {image ? (
        <Media
          className={clsx(
            "relative aspect-3/4 object-cover p-8 bg-primary-foreground",
          )}
          height={80}
          imgClassName={clsx("h-full w-full object-cover rounded-2xl", {
            "transition duration-300 ease-in-out group-hover:scale-102": true,
          })}
          resource={image}
          width={80}
        />
      ) : null}

      <div className="uppercase font-sans text-primary/50 group-hover:text-primary flex flex-col items-start items-center mt-4">
        <div>{title}</div>

        {typeof price === "number" && (
          <Price amount={price} className="font-bold text-sm" />
        )}
      </div>
    </Link>
  );
};
