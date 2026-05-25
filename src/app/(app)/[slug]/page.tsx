import configPromise from "@payload-config";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import React from "react";

import { RenderBlocks } from "@/blocks/RenderBlocks";
import { homeStaticData } from "@/endpoints/seed/home-static";
import { RenderHero } from "@/heros/RenderHero";
import type { Page } from "@/payload-types";
import { generateMeta } from "@/utilities/generateMeta";

function hasVialityBlocks(page: Page) {
  return page.content?.some((block) => block.blockType?.startsWith("viality"));
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const pages = await payload.find({
    collection: "pages",
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  const params = pages.docs?.reduce<{ slug: string }[]>((acc, doc) => {
    acc.push({ slug: doc.slug });
    return acc;
  }, []);

  return params;
}

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Page({ params }: Args) {
  const { slug = "home" } = await params;

  const page = await queryPageBySlug({ slug });

  if (slug === "home" && (!page || !hasVialityBlocks(page))) {
    const fallback = homeStaticData() as Page;
    const { hero, content } = fallback;
    return (
      <>
        <RenderHero {...hero} />
        <RenderBlocks blocks={content} />
      </>
    );
  }

  if (!page) {
    return notFound();
  }

  const { hero, content } = page;

  return (
    <>
      <RenderHero {...hero} />
      <RenderBlocks blocks={content} />
    </>
  );
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = "home" } = await params;

  const page = await queryPageBySlug({
    slug,
  });

  return generateMeta({ doc: page });
}

const queryPageBySlug = async ({ slug }: { slug: string }) => {
  const [{ isEnabled: draft }, payload] = await Promise.all([draftMode(), getPayload({ config: configPromise })]);

  const result = await payload.find({
    collection: "pages",
    draft,
    limit: 1,
    overrideAccess: draft,
    depth: 3,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: "published" } }]),
      ],
    },
  });

  return result.docs?.[0] || null;
};
