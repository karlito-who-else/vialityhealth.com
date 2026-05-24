import React from 'react'
import type { VialityComplianceBlock as VialityComplianceBlockProps } from '@/payload-types'
import { ComplianceSection } from '@/components/viality'

export const VialityComplianceBlock: React.FC<VialityComplianceBlockProps> = (props) => {
  return <ComplianceSection text={props.text} />
}
