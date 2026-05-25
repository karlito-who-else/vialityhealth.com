import configPromise from "@payload-config";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import React from "react";

import { RenderBlocks } from "@/blocks/RenderBlocks";
import { homeStaticData } from "@/endpoints/seed/home-static";
import { RenderHero } from "@/heros/RenderHero";
import type { Page } from "@/payload-types";

function hasVialityBlocks(page: Page) {
  return page.content?.some((block) => block.blockType?.startsWith("viality"));
}

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "pages",
    draft,
    limit: 1,
    overrideAccess: draft,
    depth: 3,
    pagination: false,
    where: {
      and: [
        { slug: { equals: "home" } },
        ...(draft ? [] : [{ _status: { equals: "published" as const } }]),
      ],
    },
  });

  let page = result.docs?.[0] || null;

  if (!page || !hasVialityBlocks(page)) {
    page = homeStaticData() as Page;
  }

  const { hero, content } = page;

  return (
    <>
      <RenderHero {...hero} />
      <RenderBlocks blocks={content} />
    </>
  );
}
