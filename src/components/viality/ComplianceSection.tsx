export type ComplianceSectionProps = {
  text?: string | null
}

export function ComplianceSection({ text }: ComplianceSectionProps) {
  if (!text) return null

  return (
    <section className="py-8 px-6 bg-background border-t border-border/20">
      <p className="max-w-4xl mx-auto text-center text-[10px] text-primary/35 leading-relaxed tracking-wide">
        {text}
      </p>
    </section>
  )
}
