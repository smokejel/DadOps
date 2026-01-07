'use client'

export default function Pricing() {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
  }

  const features = [
    'Compare up to 3 plans',
    'Double-deductible detection',
    'Detailed breakdown',
    'Printable summary',
  ]

  return (
    <section id="pricing" className="flex justify-center py-20">
      <div className="max-w-[1200px] px-4 md:px-10 w-full">
        <div className="flex flex-col gap-12">
          {/* Section Header */}
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#121714] dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              No monthly subscriptions. No hidden fees. Just one payment for total clarity.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="flex justify-center">
            <div className="relative max-w-md w-full">
              {/* Top Accent Bar */}
              <div className="absolute top-0 w-full h-2 bg-primary rounded-t-2xl"></div>

              {/* Card */}
              <div className="flex flex-col gap-6 bg-white dark:bg-[#1a2c22] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 md:p-10 pt-10">
                {/* Price */}
                <div className="flex flex-col gap-2 items-center">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-[#121714] dark:text-white">$19</span>
                    <span className="text-lg text-gray-600 dark:text-gray-400">one-time</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-col gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-xl">
                        check_circle
                      </span>
                      <span className="text-base text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={scrollToCalculator}
                  className="flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-green-600 hover:-translate-y-0.5"
                >
                  Get Access Now
                </button>

                {/* Guarantee */}
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
