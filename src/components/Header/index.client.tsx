'use client'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'

import { Cart } from '@/components/Cart'
import type { Header } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'

import { cn } from '@/utilities/cn'
import { usePathname } from 'next/navigation'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const { siteTitle, navItems } = header
  const menu = navItems || []
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  const onHero = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const transparent = onHero && !isScrolled

  return (
    <nav
      className={cn(
        'sticky top-0 left-0 right-0 z-40 transition-all duration-500',
        transparent
          ? 'bg-transparent'
          : 'bg-background/95 backdrop-blur-md'
      )}
    >
      <div className="h-18 container mx-auto px-6 md:px-10 flex items-center justify-between gap-6">
        {/* Mobile menu trigger */}
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} siteTitle={siteTitle || 'viality'} />
          </Suspense>
        </div>

        {/* Logo — left */}
        <Link
          href="/"
          className={cn(
            'font-serif italic tracking-[0.18em] transition-opacity hover:opacity-60 shrink-0 font-light',
            transparent ? 'text-foreground' : 'text-foreground  '
          )}
          style={{ fontSize: '1.15rem', letterSpacing: '0.18em' }}
        >
          {siteTitle || 'viality'}
        </Link>

        {/* Center nav links — desktop only */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {menu.map(({ link }) => {
            const href = link.type === 'reference' && link.reference?.value
              ? typeof link.reference.value === 'object'
                ? link.reference.value.slug ? `/${link.reference.value.slug}` : link.url || '/'
                : `/${link.reference.value}`
              : link.url || '/'
            return (
              <Link
                key={link.label}
                href={href}
                className={cn(
                  'text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-60',
                  transparent ? 'text-foreground' : 'text-foreground'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right — cart */}
        <div className="flex items-center gap-4 shrink-0">
          <div className={cn(transparent ? 'text-foreground' : 'text-foreground')}>
            <Suspense fallback={null}>
              <Cart />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  )
}
