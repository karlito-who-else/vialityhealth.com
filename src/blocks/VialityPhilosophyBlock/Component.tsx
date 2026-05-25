import { PhilosophySection } from '@/components/viality'
import type { VialityPhilosophyBlock as VialityPhilosophyBlockProps } from '@/payload-types'
import React from 'react'

export const VialityPhilosophyBlock: React.FC<VialityPhilosophyBlockProps> = (props) => {
  const { body, linkLabel, link, blockName, blockType, id, ...rest } = props
  return (
    <PhilosophySection
      {...rest}
      body={body}
      linkLabel={linkLabel}
      link={link}
    />
  )
}
