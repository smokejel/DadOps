import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-14 lg:pt-20 pb-20 lg:pb-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl text-left">
            {/* Status Badge */}
            <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              System Operational
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6 leading-[1.1]">
              Mission Control for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-300">
                First-Time Dads
              </span>
            </h1>

            <p className="text-lg leading-8 text-gray-400 mb-8 max-w-xl">
              Track costs, manage the budget, and execute baby prep tasks with military precision.
              Eliminate the chaos and prepare for deployment today.
            </p>

            <div className="flex items-center gap-x-6">
              <Link
                href="/onboarding"
                className="h-12 rounded-lg bg-emerald-500 px-8 text-base font-bold text-gray-900 shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 hover:text-white transition-all inline-flex items-center justify-center"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="relative lg:h-auto h-64 w-full">
            <div className="relative rounded-xl border border-gray-800 bg-gray-800/50 backdrop-blur-xl p-4 shadow-2xl">
              {/* Accent line */}
              <div className="absolute -top-px left-4 h-px w-20 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

              {/* Window controls */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-yellow-500" />
                  <div className="size-3 rounded-full bg-green-500" />
                </div>
                <div className="text-xs text-gray-500 font-mono">DADOPS_TERMINAL_V1.0</div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 rounded bg-gray-900 p-4 border border-gray-800">
                    <div className="text-xs text-gray-500 mb-1">RUNWAY REMAINING</div>
                    <div className="text-2xl font-bold text-white font-mono">14 WEEKS</div>
                  </div>
                  <div className="flex-1 rounded bg-gray-900 p-4 border border-gray-800">
                    <div className="text-xs text-gray-500 mb-1">BUDGET STATUS</div>
                    <div className="text-2xl font-bold text-emerald-500 font-mono">ON TRACK</div>
                  </div>
                </div>

                {/* Chart Preview */}
                <div className="h-40 w-full rounded bg-gray-900 border border-gray-800 relative overflow-hidden flex items-end justify-between px-4 pb-2 pt-8 gap-2">
                  <div className="w-full bg-gray-800/50 h-[30%] rounded-sm hover:bg-emerald-500/50 transition-colors" />
                  <div className="w-full bg-gray-800/50 h-[50%] rounded-sm hover:bg-emerald-500/50 transition-colors" />
                  <div className="w-full bg-gray-800/50 h-[40%] rounded-sm hover:bg-emerald-500/50 transition-colors" />
                  <div className="w-full bg-emerald-500 h-[75%] rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                  <div className="w-full bg-gray-800/50 h-[60%] rounded-sm hover:bg-emerald-500/50 transition-colors" />
                  <div className="absolute top-2 right-4 text-xs font-mono text-emerald-500">
                    SPENDING VELOCITY
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Task Complete Card */}
            <div className="absolute -right-4 -bottom-6 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-xl max-w-[200px] hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-green-900/30 text-emerald-500">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Task Complete</div>
                  <div className="text-sm font-bold text-white">Crib Assembled</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
