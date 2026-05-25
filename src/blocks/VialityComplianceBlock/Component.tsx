import { ComplianceSection } from '@/components/viality'
import type { VialityComplianceBlock as VialityComplianceBlockProps } from '@/payload-types'
import React from 'react'

export const VialityComplianceBlock: React.FC<VialityComplianceBlockProps> = (props) => {
  const { text, blockName, blockType, id, ...rest } = props
  return (
    <section {...rest}>
      <ComplianceSection text={text} />
    </section>
  )
}
