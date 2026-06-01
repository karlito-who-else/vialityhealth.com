export type SortFilterItem = {
  reverse: boolean;
  slug: null | string;
  title: string;
};

const defaultSort: SortFilterItem = {
  slug: null,
  reverse: false,
  title: "Alphabetic A-Z",
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { slug: "-createdAt", reverse: true, title: "Latest arrivals" },
  { slug: "priceInAUD", reverse: false, title: "Price: Low to high" }, // asc
  { slug: "-priceInAUD", reverse: true, title: "Price: High to low" },
];
