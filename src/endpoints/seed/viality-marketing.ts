import type { Payload, PayloadRequest } from 'payload'

export const seedVialityMarketing = async ({
  payload,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding viality marketing data...')

  // ── Principles ─────────────────────────────────────────────
  const principlesData = [
    { title: 'Precision', slug: 'precision', displayNumber: '01', body: 'Every compound is selected through careful evaluation of peer-reviewed evidence. We work with formulation experts who understand that getting the dose, the form, and the bioavailability right is the difference between a supplement and a ritual that works.', order: 0 },
    { title: 'Purity', slug: 'purity', displayNumber: '02', body: 'Nothing enters our formulations without a reason, and nothing unnecessary is permitted to remain. No fillers, no colorants, no compromises. Every batch is independently tested before it reaches you.', order: 1 },
    { title: 'Ritual', slug: 'ritual', displayNumber: '03', body: 'A quieter standard of vitality begins with consistency. viality is designed to become a moment — unhurried, intentional, daily. Not a chore. Not a trend. A permanent fixture of how you care for yourself.', order: 2 },
  ]

  for (const data of principlesData) {
    const existing = await payload.find({
      collection: 'principles',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'principles',
        id: existing.docs[0].id,
        data,
      })
    } else {
      await payload.create({ collection: 'principles', data })
    }
  }

  // ── FAQs ───────────────────────────────────────────────────
  const faqsData = [
    { question: 'When should I take Inner Reset?', slug: 'when-to-take', answer: 'Take two capsules in the morning with water, ideally alongside a meal. Consistency is key — we recommend integrating it into a regular daily ritual for best results.', order: 0 },
    { question: 'Is Inner Reset third-party tested?', slug: 'third-party-tested', answer: 'Yes. Every production batch is independently tested by an ISO-accredited laboratory for identity, purity, potency, and heavy metals. Certificates of Analysis are available on request.', order: 1 },
    { question: 'How long does shipping take?', slug: 'shipping-time', answer: 'Orders placed before 2 PM EST ship the same business day. Standard delivery is 3–5 business days. Express options are available at checkout. All orders over $75 qualify for complimentary shipping.', order: 2 },
    { question: 'Can I subscribe and save?', slug: 'subscribe-save', answer: 'Yes. The Ritual Subscription delivers your supply on a 30-day cycle at a 15% saving. You can pause, adjust, or cancel at any time through your account — no fees, no commitment.', order: 3 },
    { question: 'Is Inner Reset suitable for everyone?', slug: 'suitability', answer: 'Inner Reset is designed for healthy adults. It is not intended for use during pregnancy or nursing, or by individuals under 18. Always consult a qualified healthcare professional before beginning any new supplement routine.', order: 4 },
  ]

  for (const data of faqsData) {
    const existing = await payload.find({
      collection: 'faqs',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'faqs', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'faqs', data })
    }
  }

  // ── Ingredients ────────────────────────────────────────────
  const ingredientsData = [
    { name: 'Ashwagandha Extract (KSM-66)', slug: 'ashwagandha', dose: '300 mg', order: 0 },
    { name: 'Magnesium Glycinate', slug: 'magnesium-glycinate', dose: '200 mg', order: 1 },
    { name: 'Rhodiola Rosea Extract', slug: 'rhodiola-rosea', dose: '150 mg', order: 2 },
    { name: "Lion's Mane Mushroom", slug: 'lions-mane', dose: '500 mg', order: 3 },
    { name: 'Coenzyme Q10', slug: 'coenzyme-q10', dose: '100 mg', order: 4 },
    { name: 'Vitamin D3 (as Cholecalciferol)', slug: 'vitamin-d3', dose: '2000 IU', order: 5 },
    { name: 'Zinc Bisglycinate', slug: 'zinc-bisglycinate', dose: '15 mg', order: 6 },
    { name: 'Black Pepper Extract (BioPerine)', slug: 'bioperine', dose: '5 mg', order: 7 },
  ]

  for (const data of ingredientsData) {
    const existing = await payload.find({
      collection: 'ingredients',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'ingredients', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'ingredients', data })
    }
  }

  // ── Benefits ───────────────────────────────────────────────
  const benefitsData = [
    { title: 'Designed for consistency', slug: 'designed-for-consistency', body: 'Where science meets ritual. Built to be taken daily, over time — not as an experiment, but as a permanent part of how you care for yourself.', order: 0 },
    { title: 'Modern rituals for internal balance', slug: 'modern-rituals', body: 'No complicated protocol. Designed to integrate into your morning with the same quiet ease as any other considered habit.', order: 1 },
    { title: 'Calm, sustained clarity', slug: 'calm-clarity', body: 'Selected to support mental steadiness without stimulants — the kind of clarity that comes from giving your body what it actually needs.', order: 2 },
    { title: 'A quieter standard', slug: 'quieter-standard', body: 'No aggressive claims. No overcrowded formula. Every ingredient earns its place through evidence, and its dose is disclosed without exception.', order: 3 },
  ]

  for (const data of benefitsData) {
    const existing = await payload.find({
      collection: 'benefits',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'benefits', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'benefits', data })
    }
  }

  // ── Trust Items ────────────────────────────────────────────
  const homeTrustItems = [
    { title: 'Evidence-led', slug: 'evidence-led', description: 'Each compound earns its place through peer-reviewed science, not wellness trends.', type: 'home' as const, order: 0 },
    { title: 'Third-Party Verified', slug: 'third-party-verified', description: 'Every batch is independently tested. Certificates of analysis, always available.', type: 'home' as const, order: 1 },
    { title: 'Nothing unnecessary', slug: 'nothing-unnecessary', description: 'No fillers, no artificial colorants. Only what belongs.', type: 'home' as const, order: 2 },
    { title: 'GMP Manufactured', slug: 'gmp-manufactured', description: 'Produced in a certified facility where consistency is non-negotiable.', type: 'home' as const, order: 3 },
  ]

  const aboutTrustItems = [
    { title: 'Independent Lab Testing', slug: 'independent-lab-testing', description: "Every batch is third-party verified by an ISO-accredited laboratory for identity, potency, and purity. We don't ask you to take our word for it.", type: 'about' as const, order: 0 },
    { title: 'Traceable Sourcing', slug: 'traceable-sourcing', description: 'Every raw material is sourced from verified, ethical suppliers with full traceability. We know where it comes from — and you should too.', type: 'about' as const, order: 1 },
    { title: 'Batch Transparency', slug: 'batch-transparency', description: "Each product carries a batch number tied directly to its Certificate of Analysis. Clarity isn't a promise — it's a policy.", type: 'about' as const, order: 2 },
    { title: 'No Proprietary Blends', slug: 'no-proprietary-blends', description: 'Every ingredient and its exact dose is declared. No hidden quantities, no blended obscurity. What you see is precisely what you receive.', type: 'about' as const, order: 3 },
  ]

  for (const data of [...homeTrustItems, ...aboutTrustItems]) {
    const existing = await payload.find({
      collection: 'trustItems',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'trustItems', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'trustItems', data })
    }
  }

  // ── Shipping Info ──────────────────────────────────────────
  const shippingData = [
    { label: 'Complimentary Shipping', slug: 'free-shipping', detail: 'On all orders over $75', order: 0 },
    { label: 'Batch Verified', slug: 'batch-verified', detail: 'Third-party COA available for every formulation', order: 1 },
    { label: '30-Day Guarantee', slug: '30-day-guarantee', detail: 'Designed for consistency. Backed by confidence.', order: 2 },
  ]

  for (const data of shippingData) {
    const existing = await payload.find({
      collection: 'shippingInfo',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'shippingInfo', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'shippingInfo', data })
    }
  }

  // ── Trust Badges ───────────────────────────────────────────
  const badgeData = [
    { label: 'Third-party tested', slug: 'third-party-tested-badge', order: 0 },
    { label: 'Premium formulation', slug: 'premium-formulation', order: 1 },
    { label: 'Fast shipping', slug: 'fast-shipping', order: 2 },
    { label: 'Batch transparency', slug: 'badge-transparency', order: 3 },
  ]

  for (const data of badgeData) {
    const existing = await payload.find({
      collection: 'trustBadges',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'trustBadges', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'trustBadges', data })
    }
  }

  payload.logger.info('Viality marketing data seeded successfully!')
}
