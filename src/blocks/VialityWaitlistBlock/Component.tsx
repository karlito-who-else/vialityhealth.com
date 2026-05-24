import React from 'react'
import type { VialityWaitlistBlock as VialityWaitlistBlockProps } from '@/payload-types'
import { WaitlistSection } from '@/components/viality'

export const VialityWaitlistBlock: React.FC<VialityWaitlistBlockProps> = (props) => {
  return (
    <WaitlistSection
      heading={props.heading || 'Begin your daily reset.'}
      body={props.body}
      placeholder={props.placeholder || 'YOUR EMAIL ADDRESS'}
      buttonLabel={props.buttonLabel || 'Join Waitlist'}
    />
  )
}
