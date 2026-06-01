"use client";

import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import React, { useCallback } from "react";

import type { CartItem } from "@/components/Cart";

export function DeleteItemButton({
  item,
  onRemove,
}: {
  item: CartItem;
  onRemove?: (itemId: string) => void;
}) {
  const { removeItem } = useCart();
  const itemId = item.id;

  const handleRemove = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!itemId) return;
      if (onRemove) {
        onRemove(itemId);
      } else {
        removeItem(itemId);
      }
    },
    [itemId, onRemove, removeItem],
  );

  return (
    <form>
      <button
        aria-label="Remove cart item"
        className={clsx(
          "ease hover:cursor-pointer flex size-4 items-center justify-center rounded-full bg-primary transition-all duration-200",
          {
            "cursor-not-allowed px-0": !itemId,
          },
        )}
        disabled={!itemId}
        onClick={handleRemove}
        type="button"
      >
        <XIcon className="hover:text-accent-3 mx-px size-4 text-primary-foreground dark:text-foreground" />
      </button>
    </form>
  );
}
