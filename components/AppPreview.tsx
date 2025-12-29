import Image from 'next/image';

export default function AppPreview() {
  return (
    <section className="py-12 md:py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Your mission control for baby prep.
        </h2>

        {/* Three-column grid on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Dashboard */}
          <div className="relative">
            <Image
              src="/mockup-dashboard.png"
              alt="Executive Dashboard with Mission Clock, SITREP tasks, and financials"
              width={1600}
              height={1280}
              quality={85}
              className="rounded-xl shadow-xl"
              priority={false}
            />
            <p className="text-center text-gray-600 mt-4 font-medium">
              Dashboard
            </p>
          </div>

          {/* Budget */}
          <div className="relative">
            <Image
              src="/mockup-budget.png"
              alt="Budget tracker showing spending vs allocated budget"
              width={1600}
              height={1280}
              quality={85}
              className="rounded-xl shadow-xl"
              priority={false}
            />
            <p className="text-center text-gray-600 mt-4 font-medium">
              Budget
            </p>
          </div>

          {/* Roadmap */}
          <div className="relative">
            <Image
              src="/mockup-roadmap.png"
              alt="Roadmap with trimester tasks and progress tracking"
              width={1600}
              height={1280}
              quality={85}
              className="rounded-xl shadow-xl"
              priority={false}
            />
            <p className="text-center text-gray-600 mt-4 font-medium">
              Roadmap
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
