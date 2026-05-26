"use client";
import clsx from "clsx";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useCallback, useMemo } from "react";

import { Category } from "@/payload-types";

type Props = {
  category: Category;
};

const CategoryItemInner: React.FC<Props> = (props) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { category } = props;
  const isActive = useMemo(() => {
    return searchParams.get("category") === String(category.id);
  }, [category.id, searchParams]);

  const setQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (isActive) {
      params.delete("category");
    } else {
      params.set("category", String(category.id));
    }

    const newParams = params.toString();

    push(pathname + "?" + newParams);
  }, [category.id, isActive, pathname, push, searchParams]);

  return (
    <button
      type="button"
      onClick={() => setQuery()}
      className={clsx("hover:cursor-pointer", {
        " underline": isActive,
      })}
    >
      {category.title}
    </button>
  );
};

export const CategoryItem: React.FC<Props> = (props) => {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <CategoryItemInner {...props} />
    </Suspense>
  );
};
