import React from "react";

import { RichText } from "@/components/RichText";
import type { BannerBlock as BannerBlockProps } from "@/payload-types";
import { cn } from "@/utilities/cn";

export const BannerBlock: React.FC<
  BannerBlockProps & {
    id?: string | number;
    className?: string;
  }
> = (props) => {
  const { className, content, style, ...rest } = props;
  return (
    <section className={cn("bg-background py-14 md:py-18 px-6 md:px-16", className)} {...rest}>
      <div
        className={cn("max-w-4xl mx-auto border py-14 md:py-18 px-6 md:px-16 flex items-center rounded", {
          "border-border bg-card": style === "info",
          "border-error bg-error/30": style === "error",
          "border-success bg-success/30": style === "success",
          "border-warning bg-warning/30": style === "warning",
        })}
      >
        <RichText className="font-serif text-3xl md:text-4xl text-primary mb-8 leading-snug" data={content} enableGutter={false} enableProse={false} />
      </div>
    </section>
  );
};
