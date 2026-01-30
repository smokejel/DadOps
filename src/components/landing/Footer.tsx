import Link from 'next/link'
import { Logo } from '@/components/brand'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <Logo variant="full" size="sm" />

        {/* Links */}
        <div className="flex gap-8 text-sm text-gray-400">
          <Link href="#" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Support
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-600">
          © {currentYear} DadOps Inc. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
