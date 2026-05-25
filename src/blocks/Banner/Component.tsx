import { RichText } from '@/components/RichText'
import type { BannerBlock as BannerBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'

export const BannerBlock: React.FC<
  BannerBlockProps & {
    id?: string | number
    className?: string
  }
> = (props) => {
  const { className, content, style, ...rest } = props
  return (
    <section className={cn('mx-auto my-8 w-full', className)} {...rest}>
      <div
        className={cn('border py-3 px-6 flex items-center rounded', {
          'border-border bg-card': style === 'info',
          'border-error bg-error/30': style === 'error',
          'border-success bg-success/30': style === 'success',
          'border-warning bg-warning/30': style === 'warning',
        })}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </section>
  )
}
