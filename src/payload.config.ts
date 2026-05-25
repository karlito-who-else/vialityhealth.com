import { neon } from '@neondatabase/serverless'
import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Benefits } from '@/collections/Benefits'
import { Categories } from '@/collections/Categories'
import { Faqs } from '@/collections/Faqs'
import { FeaturedProducts } from '@/collections/FeaturedProducts'
import { Ingredients } from '@/collections/Ingredients'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Principles } from '@/collections/Principles'
import { ShippingInfo } from '@/collections/ShippingInfo'
import { TrustBadges } from '@/collections/TrustBadges'
import { TrustItems } from '@/collections/TrustItems'
import { Users } from '@/collections/Users'
import { About } from '@/globals/About'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { Settings } from '@/globals/Settings'
import { VialityHero } from '@/blocks/VialityHeroBlock/config'
import { VialityPhilosophy } from '@/blocks/VialityPhilosophyBlock/config'
import { VialityFeaturedProducts } from '@/blocks/VialityFeaturedProductsBlock/config'
import { VialityTrust } from '@/blocks/VialityTrustBlock/config'
import { VialityWaitlist } from '@/blocks/VialityWaitlistBlock/config'
import { VialityShipping } from '@/blocks/VialityShippingBlock/config'
import { VialityCompliance } from '@/blocks/VialityComplianceBlock/config'
import { BenefitsBlock } from '@/blocks/BenefitsBlock/config'
import { FaqsBlock } from '@/blocks/FaqsBlock/config'
import { IngredientsBlock } from '@/blocks/IngredientsBlock/config'
import { PrinciplesBlock } from '@/blocks/PrinciplesBlock/config'
import { TrustItemsBlock } from '@/blocks/TrustItemsBlock/config'
import { ShippingInfoBlock } from '@/blocks/ShippingInfoBlock/config'
import { TrustBadgesBlock } from '@/blocks/TrustBadgesBlock/config'
import { FeaturedProductsBlock } from '@/blocks/FeaturedProductsBlock/config'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard'],
    },
    user: Users.slug,
  },
  collections: [Users, Pages, Categories, Media, Principles, Faqs, Ingredients, Benefits, TrustItems, ShippingInfo, TrustBadges, FeaturedProducts],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  //email: nodemailerAdapter(),
  endpoints: [],
  globals: [About, Header, Footer, Settings],
  blocks: [
    VialityHero,
    VialityPhilosophy,
    VialityFeaturedProducts,
    VialityTrust,
    VialityWaitlist,
    VialityShipping,
    VialityCompliance,
    BenefitsBlock,
    FaqsBlock,
    IngredientsBlock,
    PrinciplesBlock,
    TrustItemsBlock,
    ShippingInfoBlock,
    TrustBadgesBlock,
    FeaturedProductsBlock,
  ],
  plugins,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // sharp,
})
