'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded bg-emerald-500/20 text-emerald-500">
            <span className="material-symbols-outlined text-[24px]">radar</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">DadOps</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-gray-300 hover:text-emerald-500 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#cost-estimator"
            className="text-sm font-medium text-gray-300 hover:text-emerald-500 transition-colors"
          >
            Cost Estimator
          </a>
          <a
            href="#cta"
            className="text-sm font-medium text-gray-300 hover:text-emerald-500 transition-colors"
          >
            Get Started
          </a>
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
            className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-gray-900 shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
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
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-300 hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </a>
            <a
              href="#cost-estimator"
              className="text-sm font-medium text-gray-300 hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cost Estimator
            </a>
            <a
              href="#cta"
              className="text-sm font-medium text-gray-300 hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </a>
            <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-gray-900 shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
