import { getCachedGlobal } from "@/utilities/getGlobals";

import { HeaderClient } from "./index.client";

export async function Header({ className }: { className?: string }) {
  const [header, settings] = await Promise.all([
    getCachedGlobal("header", 2)(),
    getCachedGlobal("settings", 2)(),
  ]);

  return <HeaderClient className={className} header={header} settings={settings} />;
}
