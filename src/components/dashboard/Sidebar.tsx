'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/brand'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/dashboard/roadmap', label: 'Roadmap', icon: 'checklist' },
  { href: '/dashboard/war-chest', label: 'Budget', icon: 'savings' },
  { href: '/dashboard/compare', label: 'Compare Plans', icon: 'compare' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Logo variant="full" size="md" showTagline />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Action */}
      <div className="p-4 border-t border-gray-800">
        <Link
          href="/dashboard/war-chest"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Log Expense
        </Link>
      </div>
    </aside>
  )
}
