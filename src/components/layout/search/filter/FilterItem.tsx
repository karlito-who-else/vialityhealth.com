"use client";

import { Link } from "@/components/atoms/Link";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import type { SortFilterItem as SortFilterItemType } from "@/lib/constants";
import { createUrl } from "@/utilities/createUrl";

import type { ListItem, PathFilterItem as PathFilterItemType } from ".";

function PathFilterItemInner({ item }: { item: PathFilterItemType }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? "p" : Link;

  newParams.delete("q");

  return (
    <li className="mt-2 flex text-foreground uppercase" key={item.title}>
      <DynamicTag
        className={clsx("w-full text-xs lg:text-lg underline-offset-4 hover:underline", {
          "underline underline-offset-4": active,
        })}
        href={createUrl(item.path, newParams)}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

function SortFilterItemInner({ item }: { item: SortFilterItemType }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") === item.slug;
  const q = searchParams.get("q");
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug }),
    }),
  );
  const DynamicTag = active ? "p" : Link;

  return (
    <li className="mt-2 flex text-sm text-foreground uppercase" key={item.title}>
      <DynamicTag
        className={clsx("w-full text-xs lg:text-lg hover:underline hover:underline-offset-4", {
          "underline underline-offset-4": active,
        })}
        href={href}
        prefetch={!active ? false : undefined}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

function PathFilterItem(props: { item: PathFilterItemType }) {
  return (
    <Suspense fallback={null}>
      <PathFilterItemInner {...props} />
    </Suspense>
  );
}

function SortFilterItem(props: { item: SortFilterItemType }) {
  return (
    <Suspense fallback={null}>
      <SortFilterItemInner {...props} />
    </Suspense>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return "path" in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />;
}
