export default function Footer() {
  return (
    <footer className="flex justify-center py-12 bg-white dark:bg-[#122017] border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-[1200px] px-4 md:px-10 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">calculate</span>
            </div>
            <span className="text-xl font-bold text-[#121714] dark:text-white">DadOps</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <div className="flex flex-col gap-2 items-center md:items-end">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2026 DadOps Inc. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center md:text-right max-w-md">
              DadOps provides estimates based on your inputs. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
