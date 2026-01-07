'use client'

export default function FinalCTA() {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="flex justify-center py-16 md:py-20 bg-primary/10 dark:bg-primary/5">
      <div className="max-w-[800px] px-4 md:px-10 w-full">
        <div className="flex flex-col gap-6 items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#121714] dark:text-white">
            Ready to feel prepared?
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            Stop guessing at hospital bills. Get the financial clarity you need to focus on the baby.
          </p>
          <button
            onClick={scrollToCalculator}
            className="flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-green-600 hover:-translate-y-0.5"
          >
            Start Calculating Free
          </button>
        </div>
      </div>
    </section>
  )
}
