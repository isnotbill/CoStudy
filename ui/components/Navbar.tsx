'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function Navbar() {
  const { theme, toggle } = useTheme()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative z-10 w-full px-6 py-5"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-cedarville text-[28px] tracking-wide select-none
            text-indigo-700 dark:text-indigo-200
            dark:drop-shadow-[0_0_22px_rgba(165,180,252,0.45)]
            hover:opacity-75 transition-opacity duration-200"
        >
          costudy
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-2 rounded-full transition-all duration-200
              text-indigo-600 dark:text-indigo-300/80
              hover:bg-indigo-50 dark:hover:bg-white/8"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -20, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 20, scale: 0.7 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="block"
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Login */}
          <Link
            href="/login"
            className="px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-200
              bg-indigo-600 text-white hover:bg-indigo-700
              dark:bg-transparent dark:text-indigo-200 dark:border dark:border-indigo-400/25
              dark:hover:bg-indigo-500/15 dark:hover:border-indigo-400/40"
          >
            Login
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
