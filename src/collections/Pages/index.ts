import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { CollectionConfig } from "payload";
import { slugField } from "payload";

import { adminOnly } from "@/access/adminOnly";
import { adminOrPublishedStatus } from "@/access/adminOrPublishedStatus";
import { AboutCta } from "@/blocks/AboutCtaBlock/config";
import { AboutFounder } from "@/blocks/AboutFounderBlock/config";
import { AboutHero } from "@/blocks/AboutHeroBlock/config";
import { AboutPhilosophy } from "@/blocks/AboutPhilosophyBlock/config";
import { AboutPrinciples } from "@/blocks/AboutPrinciplesBlock/config";
import { AboutTrust } from "@/blocks/AboutTrustBlock/config";
import { Archive } from "@/blocks/ArchiveBlock/config";
import { Banner } from "@/blocks/Banner/config";
import { CallToAction } from "@/blocks/CallToAction/config";
import { Carousel } from "@/blocks/Carousel/config";
import { Content } from "@/blocks/Content/config";
import { FormBlock } from "@/blocks/Form/config";
import { MediaBlock } from "@/blocks/MediaBlock/config";
import { ThreeItemGrid } from "@/blocks/ThreeItemGrid/config";
import { VialityCompliance } from "@/blocks/VialityComplianceBlock/config";
import { VialityFeaturedProducts } from "@/blocks/VialityFeaturedProductsBlock/config";
import { VialityHero } from "@/blocks/VialityHeroBlock/config";
import { VialityPhilosophy } from "@/blocks/VialityPhilosophyBlock/config";
import { VialityShipping } from "@/blocks/VialityShippingBlock/config";
import { VialityTrust } from "@/blocks/VialityTrustBlock/config";
import { VialityWaitlist } from "@/blocks/VialityWaitlistBlock/config";
import { hero } from "@/fields/hero";
import { generatePreviewPath } from "@/utilities/generatePreviewPath";

import { revalidateDelete, revalidatePage } from "./hooks/revalidatePage";

export const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOrPublishedStatus,
    update: adminOnly,
  },
  admin: {
    group: "Content",
    defaultColumns: ["title", "slug", "updatedAt"],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: "pages",
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: "pages",
        req,
      }),
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "publishedOn",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          fields: [hero],
          label: "Hero",
        },
        {
          fields: [
            {
              name: "content",
              type: "blocks",
              blocks: [
                AboutCta,
                AboutFounder,
                AboutHero,
                AboutPhilosophy,
                AboutPrinciples,
                AboutTrust,
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                Carousel,
                ThreeItemGrid,
                Banner,
                FormBlock,
                VialityHero,
                VialityPhilosophy,
                VialityFeaturedProducts,
                VialityTrust,
                VialityWaitlist,
                VialityShipping,
                VialityCompliance,
              ],
              required: true,
            },
          ],
          label: "Content",
        },
        {
          name: "meta",
          label: "SEO",
          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: "media",
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: "meta.title",
              descriptionPath: "meta.description",
            }),
          ],
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
};
