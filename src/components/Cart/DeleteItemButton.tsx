"use client";

import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import React from "react";

import type { CartItem } from "@/components/Cart";

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { isLoading, removeItem } = useCart();
  const itemId = item.id;

  return (
    <form>
      <button
        aria-label="Remove cart item"
        className={clsx(
          "ease hover:cursor-pointer flex h-4 w-4 items-center justify-center rounded-full bg-muted-foreground transition-all duration-200",
          {
            "cursor-not-allowed px-0": !itemId || isLoading,
          },
        )}
        disabled={!itemId || isLoading}
        onClick={(e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault();
          if (itemId) removeItem(itemId);
        }}
        type="button"
      >
        <XIcon className="hover:text-accent-3 mx-px h-4 w-4 text-primary-foreground dark:text-foreground" />
      </button>
    </form>
  );
}
