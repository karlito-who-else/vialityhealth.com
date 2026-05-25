"use client";

import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

import { cn } from "@/utilities/cn";
import { createUrl } from "@/utilities/createUrl";

type Props = {
  className?: string;
};

const SearchInner: React.FC<Props> = (props) => {
  const { className } = props;
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const { get, toString } = searchParams;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(toString());

    if (search.value) {
      newParams.set("q", search.value);
    } else {
      newParams.delete("q");
    }

    push(createUrl("/shop", newParams));
  }

  return (
    <form className={cn("relative w-full", className)} onSubmit={onSubmit}>
      <input
        autoComplete="off"
        className="w-full rounded-lg border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground dark:border-card dark:bg-ink-well dark:text-primary-foreground dark:placeholder:text-muted-foreground"
        defaultValue={get("q") || ""}
        key={get("q")}
        name="search"
        placeholder="Search for products..."
        type="text"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
    </form>
  );
};

export const Search: React.FC<Props> = (props) => {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SearchInner {...props} />
    </Suspense>
  );
};
