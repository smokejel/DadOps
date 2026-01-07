export default function WhyDadOps() {
  const features = [
    {
      icon: 'bar_chart',
      title: 'Decode Insurance Jargon',
      description: 'We translate confusing terms like "out-of-pocket max" into plain English.',
    },
    {
      icon: 'search',
      title: 'Spot Hidden Fees',
      description: 'Uncover costs that HR never mentions, like double deductibles.',
    },
    {
      icon: 'verified_user',
      title: 'Gain Peace of Mind',
      description: 'Make confident decisions knowing the real numbers.',
    },
  ]

  return (
    <section className="flex justify-center py-16 md:py-20 bg-white dark:bg-[#1a2c22]">
      <div className="max-w-[1200px] px-4 md:px-10 w-full">
        <div className="flex flex-col gap-12">
          {/* Section Header */}
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#121714] dark:text-white">
              Why DadOps?
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto">
              Insurance companies profit from confusion. We cut through the noise.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-xl border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-surface-dark p-6 transition-transform hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-[#121714] dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
