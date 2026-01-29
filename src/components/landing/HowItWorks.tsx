const steps = [
  {
    icon: 'calendar_month',
    title: '1. Input Due Date',
    description:
      'Calculate your runway. Our algorithm reverse-engineers a weekly timeline from today until T-Minus zero.',
  },
  {
    icon: 'calculate',
    title: '2. Estimate Costs',
    description:
      'Know your financial deployment. Project medical bills, nursery setup, and recurring diaper logistics costs.',
  },
  {
    icon: 'map',
    title: '3. Follow the Roadmap',
    description:
      'Execute weekly tasks. From painting the nursery to installing the car seat, never miss a mission-critical step.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-900 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How DadOps Works
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Three simple steps to achieve full financial readiness before arrival.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-gray-800 bg-gray-800 p-8 hover:border-emerald-500/50 transition-colors"
            >
              {/* Icon Badge */}
              <div className="absolute -top-6 left-8 flex size-12 items-center justify-center rounded-xl bg-gray-900 border border-gray-700 shadow-lg text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined">{step.icon}</span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
