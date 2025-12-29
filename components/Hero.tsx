import SignupForm from './SignupForm';

export default function Hero() {
  return (
    <section className="py-12 md:py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          The financial command center for expecting dads.
        </h1>

        {/* Subhead */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
          Know what the hospital will actually cost. Track your baby prep budget. Stop getting blindsided by bills.
        </p>

        {/* Personal Hook */}
        <p className="text-sm md:text-base text-gray-700 italic mb-12">
          Built by a dad who got blindsided by a $6k hospital bill.
        </p>

        {/* Signup Form */}
        <div className="max-w-md mx-auto mb-16">
          <SignupForm />
        </div>

        {/* Feature Bullets */}
        <div className="max-w-2xl mx-auto space-y-4 text-left">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <p className="text-base md:text-lg text-gray-700 flex-1">
              Estimate your real hospital costs before the bill arrives
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <p className="text-base md:text-lg text-gray-700 flex-1">
              Track every task from nursery setup to insurance calls
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <p className="text-base md:text-lg text-gray-700 flex-1">
              Budget for gear, medical, and the surprises nobody warns you about
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
