'use client'

import Image from 'next/image'

export default function Hero() {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="flex justify-center py-12 md:py-20">
      <div className="max-w-[1200px] px-4 md:px-10 w-full">
        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-center">
          {/* Text Column */}
          <div className="flex-1 flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-[#121714] dark:text-white">
                Take the Surprise Out of Birth Costs.
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                The only calculator designed for dads to compare insurance plans and estimate the real cost of your baby's first year.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToCalculator}
                className="flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-green-600 hover:-translate-y-0.5"
              >
                Start Calculating Free
              </button>
              <button
                onClick={scrollToCalculator}
                className="flex h-12 items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-8 text-base font-bold text-[#121714] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                View Sample Report
              </button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-primary text-[18px]">
                lock
              </span>
              <span>Private & Secure. No spam.</span>
            </div>
          </div>

          {/* Image Column */}
          <div className="flex-1 w-full">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/Landing_Image2.png"
                alt="DadOps birth cost calculator preview"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
