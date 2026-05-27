import React from "react";

import { RichText } from "@/components/RichText";
import type { Page } from "@/payload-types";

type LowImpactHeroType =
  | {
    children?: React.ReactNode;
    richText?: never;
  }
  | (Omit<Page["hero"], "richText"> & {
    children?: never;
    richText?: Page["hero"]["richText"];
  });

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <section className="py-36 px-6 bg-background" data-component="LowImpactHero">
      <div className="max-w-4xl mx-auto text-center">
        {children || (richText && <RichText className="font-serif text-2xl md:text-4xl leading-relaxed text-primary/90" data={richText} enableGutter={false} />)}
      </div>
    </section>
  );
};
