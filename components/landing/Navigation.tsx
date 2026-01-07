'use client'

export default function Navigation() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5e7eb] dark:border-[#2a3830] bg-white/90 dark:bg-background-dark/90 backdrop-blur-md">
      <div className="flex justify-center">
        <div className="max-w-[1200px] px-4 md:px-10 w-full flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">calculate</span>
            </div>
            <span className="text-xl font-bold text-[#121714] dark:text-white">DadOps</span>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo('how-it-works')}
              className="text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('pricing')}
              className="text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
            >
              Pricing
            </button>
          </nav>

          {/* CTA Button */}
          <button
            onClick={() => scrollTo('calculator')}
            className="flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm md:text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-green-600 hover:-translate-y-0.5"
          >
            Calculate My Costs
          </button>
        </div>
      </div>
    </header>
  )
}
