export default function RealityCheck() {
  return (
    <section className="flex justify-center py-16 md:py-20 bg-white dark:bg-[#1a2c22]">
      <div className="max-w-[800px] px-4 md:px-10 w-full">
        <div className="flex flex-col gap-12">
          {/* Section Header */}
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#121714] dark:text-white">
              Reality Check
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto">
              Real stories from expecting fathers navigating insurance costs
            </p>
          </div>

          {/* Quote Blocks */}
          <div className="flex flex-col gap-6">
            {/* Quote Block 1 - Double Deductible */}
            <div className="text-center py-6 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-[#121714] dark:text-white mb-3">
                "My out of pocket is gonna wind up at $25k... the insurance year reset so [we hit] double maxes."
              </blockquote>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                — Reddit User (r/NewDads)
              </p>
            </div>

            {/* Quote Block 2 - Cost Fear */}
            <div className="text-center py-6 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-[#121714] dark:text-white mb-3">
                "Knowing there's a $30,000+ bill waiting at the end of it is horrible."
              </blockquote>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                — Reddit User (r/predaddit)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
