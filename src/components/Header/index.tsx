import { getCachedGlobal } from "@/utilities/getGlobals";

import { HeaderClient } from "./index.client";

export async function Header({ className }: { className?: string }) {
  const header = await getCachedGlobal("header", 2)();

  return <HeaderClient className={className} header={header} />;
}
