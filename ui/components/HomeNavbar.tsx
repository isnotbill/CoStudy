'use client'

import Link from 'next/link'
import Image from 'next/image'
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

interface Props {
  profile: { username: string; image?: string | null } | null
  avatarSrc: string
}

export function HomeNavbar({ profile, avatarSrc }: Props) {
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
          href="/home"
          className="font-cedarville text-[28px] tracking-wide select-none
            text-indigo-700 dark:text-indigo-200
            dark:drop-shadow-[0_0_22px_rgba(165,180,252,0.45)]
            hover:opacity-75 transition-opacity duration-200"
        >
          costudy
        </Link>

        {/* Right */}
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

          {/* Settings */}
          <Link
            href="/settings"
            aria-label="Settings"
            className="p-2 rounded-full transition-all duration-200
              text-gray-500 dark:text-white/40
              hover:bg-black/[0.04] dark:hover:bg-white/8"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>

          {/* Avatar */}
          {profile && (
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-indigo-400/30">
              <Image
                src={avatarSrc}
                alt={profile.username}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
