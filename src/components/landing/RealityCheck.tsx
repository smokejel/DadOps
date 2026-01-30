export default function RealityCheck() {
  const quotes = [
    {
      text: "My out of pocket is gonna wind up at $25k... the insurance year reset so [we hit] double maxes.",
      source: "Reddit User",
      subreddit: "r/NewDads",
    },
    {
      text: "Knowing there's a $30,000+ bill waiting at the end of it is horrible.",
      source: "Reddit User",
      subreddit: "r/predaddit",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Reality Check
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Real stories from expecting fathers navigating insurance costs
          </p>
        </div>

        {/* Quote Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {quotes.map((quote, index) => (
            <div
              key={index}
              className="rounded-2xl bg-gray-800/50 border border-gray-700 p-8 relative overflow-hidden"
            >
              {/* Quote mark decoration */}
              <div className="absolute top-4 left-4 text-6xl text-primary/10 font-serif leading-none">
                &ldquo;
              </div>

              <blockquote className="relative z-10">
                <p className="text-gray-300 text-lg italic leading-relaxed mb-6">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <footer className="text-sm">
                  <span className="text-gray-500">— {quote.source}</span>
                  <span className="text-primary ml-2">({quote.subreddit})</span>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
