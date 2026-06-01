"use client";

import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import clsx from "clsx";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useCallback, useMemo } from "react";

import { CartItem } from "@/components/Cart";

export function EditItemQuantityButton({
  type,
  item,
  onDecrement,
  onIncrement,
}: {
  item: CartItem;
  type: "minus" | "plus";
  onDecrement?: (itemId: string) => void;
  onIncrement?: (itemId: string) => void;
}) {
  const { decrementItem, incrementItem } = useCart();

  const disabled = useMemo(() => {
    if (!item.id) return true;

    const target =
      item.variant && typeof item.variant === "object"
        ? item.variant
        : item.product && typeof item.product === "object"
          ? item.product
          : null;

    if (
      target &&
      typeof target === "object" &&
      target.inventory !== undefined &&
      target.inventory !== null
    ) {
      if (type === "plus" && item.quantity !== undefined && item.quantity !== null) {
        return item.quantity >= target.inventory;
      }
    }

    return false;
  }, [item, type]);

  const handleClick = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!item.id) return;
      if (type === "plus") {
        if (onIncrement) {
          onIncrement(item.id);
        } else {
          incrementItem(item.id);
        }
      } else {
        if (onDecrement) {
          onDecrement(item.id);
        } else {
          decrementItem(item.id);
        }
      }
    },
    [item.id, type, onDecrement, onIncrement, decrementItem, incrementItem],
  );

  return (
    <form>
      <button
        disabled={disabled}
        aria-label={type === "plus" ? "Increase item quantity" : "Reduce item quantity"}
        className={clsx(
          "ease hover:cursor-pointer flex h-full min-w-9 max-w-9 flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
          {
            "cursor-not-allowed": disabled,
            "ml-auto": type === "minus",
          },
        )}
        onClick={handleClick}
        type="button"
      >
        {type === "plus" ? (
          <PlusIcon className="size-4 dark:text-muted-foreground hover:text-ring" />
        ) : (
          <MinusIcon className="size-4 dark:text-muted-foreground hover:text-ring" />
        )}
      </button>
    </form>
  );
}
