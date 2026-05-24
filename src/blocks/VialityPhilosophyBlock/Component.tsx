import React from 'react'
import type { VialityPhilosophyBlock as VialityPhilosophyBlockProps } from '@/payload-types'
import { PhilosophySection } from '@/components/viality'

export const VialityPhilosophyBlock: React.FC<VialityPhilosophyBlockProps> = (props) => {
  return (
    <PhilosophySection
      body={props.body}
      linkLabel={props.linkLabel}
      link={props.link}
    />
  )
}
