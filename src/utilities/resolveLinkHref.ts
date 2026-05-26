type LinkData = {
  type?: "reference" | "custom" | null;
  reference?: {
    relationTo?: string;
    value?: unknown;
  } | null;
  url?: string | null;
};

export function resolveLinkHref(link: LinkData): string {
  if (link.type === "reference" && link.reference) {
    const refValue =
      typeof link.reference === "object" && "value" in link.reference
        ? link.reference.value
        : link.reference;

    if (refValue != null) {
      if (typeof refValue === "object" && refValue && "slug" in refValue && refValue.slug) {
        return `/${refValue.slug}`;
      }

      if (typeof refValue === "string" || typeof refValue === "number") {
        return `/${refValue}`;
      }
    }
  }

  return link.url || "#";
}
