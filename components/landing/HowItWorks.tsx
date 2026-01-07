export default function HowItWorks() {
  const steps = [
    {
      icon: 'edit_note',
      title: 'Input Info',
      description: 'Enter your due date and insurance details',
    },
    {
      icon: 'compare_arrows',
      title: 'Compare Plans',
      description: 'We calculate costs for up to 3 plans',
    },
    {
      icon: 'description',
      title: 'Get Your Report',
      description: 'See which plan saves you the most money',
    },
  ]

  return (
    <section id="how-it-works" className="flex justify-center py-12 md:py-16">
      <div className="max-w-[960px] px-4 md:px-10 w-full">
        <div className="flex flex-col gap-8">
          {/* Section Header */}
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#121714] dark:text-white">
              How It Works
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              Three simple steps to financial clarity
            </p>
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-6">
            {steps.map((step, index) => (
              <div key={index} className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_1fr] gap-4 md:gap-6">
                {/* Left Column: Icon + Line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary text-white flex-shrink-0">
                    <span className="material-symbols-outlined text-xl md:text-2xl">{step.icon}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 bg-gray-200 dark:bg-gray-700 h-full min-h-[60px] my-2"></div>
                  )}
                </div>

                {/* Right Column: Content */}
                <div className="flex flex-col gap-2 pb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-[#121714] dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
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
