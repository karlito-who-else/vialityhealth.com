import { getCachedGlobal } from "@/utilities/getGlobals";

export async function SiteBanner() {
  const settings = await getCachedGlobal("settings", 1)();

  const banner = settings?.siteBanner;
  const enabled = banner?.enabled ?? true;
  const content = banner?.content || "Free shipping on orders over $200";

  if (!enabled) {
    return null;
  }

  const items = Array.from({ length: 4 }, (_, i) => (
    <span key={i} className="shrink-0" style={{ paddingRight: "25vw" }}>
      {content}
    </span>
  ));

  return (
    <div className="bg-foreground text-background overflow-hidden text-xs uppercase tracking-widest py-2.5 leading-none">
      <div className="animate-marquee-banner flex w-fit">
        {items}
      </div>
    </div>
  );
}
