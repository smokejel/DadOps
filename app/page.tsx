import Navigation from '@/components/landing/Navigation'
import Hero from '@/components/landing/Hero'
import WhyDadOps from '@/components/landing/WhyDadOps'
import HowItWorks from '@/components/landing/HowItWorks'
import RealityCheck from '@/components/landing/RealityCheck'
import Pricing from '@/components/landing/Pricing'
import FinalCTA from '@/components/landing/FinalCTA'
import CalculatorFlow from '@/components/calculator/CalculatorFlow'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Navigation />
      <Hero />
      <WhyDadOps />
      <HowItWorks />
      <RealityCheck />
      <Pricing />
      <FinalCTA />
      <CalculatorFlow />
      <Footer />
    </div>
  )
}
