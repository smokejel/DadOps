'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/brand'

const navLinks = [
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#cost-estimator', label: 'Cost Estimator' },
  { href: '#cta', label: 'Get Started' },
]

const navLinkStyles = 'text-sm font-medium text-gray-300 hover:text-primary transition-colors'
const ctaButtonStyles = 'inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-gray-900 shadow-lg shadow-primary/20 hover:bg-primary-dark hover:text-white transition-all'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function closeMobileMenu(): void {
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo variant="full" size="sm" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={navLinkStyles}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/onboarding"
            className={`${ctaButtonStyles} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900/95 backdrop-blur-md">
          <nav className="flex flex-col px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={navLinkStyles}
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link href="/onboarding" className={`${ctaButtonStyles} h-10`}>
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
