import Link from 'next/link'
import React from 'react'

export async function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground py-16 px-6 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link
            href="/"
            className="font-serif italic font-light tracking-[0.2em] block mb-6 hover:opacity-70 transition-opacity"
            style={{ fontSize: '1.45rem' }}
          >
            viality
          </Link>
          <p className="text-primary-foreground/70 max-w-sm font-light leading-relaxed">
            Wellness, refined. Modern rituals for internal balance — designed for consistency, and held to a quieter standard.
          </p>
        </div>

        <div>
          <h4 className="uppercase tracking-widest text-xs font-semibold mb-6">Explore</h4>
          <ul className="space-y-4 text-sm text-primary-foreground/70">
            <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-accent transition-colors">Philosophy</Link></li>
            <li><Link href="/shop" className="hover:text-accent transition-colors">Shop</Link></li>
            <li><Link href="/about" className="hover:text-accent transition-colors">Lab Reports</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="uppercase tracking-widest text-xs font-semibold mb-6">Connect</h4>
          <ul className="space-y-4 text-sm text-primary-foreground/70">
            <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Wholesale</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
        <p>&copy; {currentYear} viality. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary-foreground transition-colors">Terms</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 text-[10px] text-primary-foreground/30 text-center uppercase tracking-widest leading-relaxed">
        <p>These statements have not been evaluated by the Food and Drug Administration.</p>
        <p>This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
      </div>
    </footer>
  )
}
