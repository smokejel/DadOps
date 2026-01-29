import { Header, Hero, HowItWorks, RealityCheck, CostEstimator, CTASection, Footer } from '@/components/landing'

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-gray-900 text-gray-100 antialiased selection:bg-emerald-500 selection:text-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <RealityCheck />
        <CostEstimator />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
