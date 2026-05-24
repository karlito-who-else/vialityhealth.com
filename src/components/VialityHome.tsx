'use client'

import type { TrustItem, ShippingInfo, FeaturedProduct, Home, Product } from '@/payload-types'
import {
  HeroSection,
  PhilosophySection,
  FeaturedProductsSection,
  TrustSection,
  WaitlistSection,
  ShippingSection,
  ComplianceSection,
} from '@/components/viality'

export function VialityHome({ trustItems, shippingItems, featuredProducts, home }: { trustItems: TrustItem[]; shippingItems: ShippingInfo[]; featuredProducts: (FeaturedProduct & { product: Product })[]; home: Home }) {
  const products = featuredProducts.map((fp) => fp.product)

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        tagline={home?.heroTagline || 'Wellness, refined.'}
        title={home?.heroTitle || 'viality'}
        subtext={home?.heroSubtext || 'Where science meets ritual.'}
        ctaLabel={home?.heroCTALabel || 'Begin the Ritual'}
        ctaLink={home?.heroCTALink || '/shop'}
        secondaryLabel={home?.heroSecondaryLabel || 'Our Philosophy'}
        secondaryLink={home?.heroSecondaryLink || '/about'}
        scrollLabel={home?.heroScrollLabel || 'Scroll'}
      />
      <PhilosophySection
        body={home?.philosophyBody}
        linkLabel={home?.philosophyLinkLabel || 'Our Story'}
        link={home?.philosophyLink || '/about'}
      />
      <FeaturedProductsSection
        heading={home?.collectionHeading || 'The Collection'}
        shopAllLabel={home?.shopAllLabel || 'Shop All'}
        products={products}
      />
      <TrustSection
        heading={home?.trustHeading || 'A quieter standard of vitality.'}
        body={home?.trustBody}
        ctaLabel={home?.trustCTALabel || 'View Lab Reports'}
        ctaLink={home?.trustCTALink || '/about'}
        items={trustItems}
      />
      <WaitlistSection
        heading={home?.waitlistHeading || 'Begin your daily reset.'}
        body={home?.waitlistBody}
        placeholder={home?.waitlistPlaceholder || 'YOUR EMAIL ADDRESS'}
        buttonLabel={home?.waitlistButtonLabel || 'Join Waitlist'}
      />
      <ShippingSection items={shippingItems} />
      <ComplianceSection text={home?.complianceText} />
    </div>
  )
}
