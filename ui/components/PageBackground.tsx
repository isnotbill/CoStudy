'use client'

import { ReactNode } from 'react'

// Seeded pseudo-random — deterministic (no SSR mismatch) but looks truly random
function sr(seed: number) {
  const s = Math.sin(seed * 9301 + 49297) * 233280
  return s - Math.floor(s)
}
const STARS = Array.from({ length: 88 }, (_, i) => ({
  cx:      +(sr(i)       * 100).toFixed(1),
  cy:      +(sr(i + 100) * 100).toFixed(1),
  r:       sr(i + 200) > 0.92 ? 2.1 : sr(i + 200) > 0.72 ? 1.3 : 0.75,
  opacity: +(0.1 + sr(i + 300) * 0.52).toFixed(2),
}))

interface PageBackgroundProps {
  children: ReactNode
  /** Show the sun (light) / moon (dark) celestial body. Default: false. */
  showCelestial?: boolean
}

export function PageBackground({ children, showCelestial = false }: PageBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-page-bg transition-colors duration-500">

      {/* ── Background layers ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Dark mode — main atmospheric glows */}
        <div className="orb-1 absolute -top-[25%] -left-[12%] w-[65vw] h-[65vw] rounded-full
          bg-indigo-600/[0.13] blur-[150px] opacity-0 dark:opacity-100 transition-opacity duration-700" />
        <div className="orb-2 absolute -bottom-[20%] -right-[8%] w-[50vw] h-[50vw] rounded-full
          bg-violet-700/[0.11] blur-[120px] opacity-0 dark:opacity-100 transition-opacity duration-700" />

        {showCelestial && (
          <>
            {/* Moon — dark mode only */}
            <div className="absolute top-20 lg:top-[16%] left-[10%] opacity-0 dark:opacity-100 transition-opacity duration-700">
              <div className="moon-halo absolute rounded-full pointer-events-none"
                style={{ inset: '-130px', background: 'radial-gradient(circle, rgba(200,212,255,0.1) 0%, rgba(160,175,255,0.04) 50%, transparent 72%)' }} />
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-white/95 to-slate-200/85"
                style={{ boxShadow: '0 0 16px rgba(255,255,255,0.7), 0 0 50px rgba(200,215,255,0.45), 0 0 150px rgba(160,175,255,0.22)' }} />
            </div>

            {/* Sun — light mode only */}
            <div className="absolute top-20 lg:top-[16%] left-[10%] opacity-100 dark:opacity-0 transition-opacity duration-700">
              <div className="sun-halo absolute rounded-full pointer-events-none"
                style={{ inset: '-130px', background: 'radial-gradient(circle, rgba(251,191,36,0.16) 0%, rgba(253,186,116,0.07) 45%, transparent 70%)' }} />
              <div className="sun-rays absolute rounded-full pointer-events-none"
                style={{ inset: '-55px', background: 'radial-gradient(circle, transparent 32%, rgba(251,191,36,0.06) 54%, transparent 74%)' }} />
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-yellow-200 to-amber-400"
                style={{ boxShadow: '0 0 22px rgba(251,191,36,0.6), 0 0 60px rgba(253,186,116,0.32), 0 0 160px rgba(253,220,100,0.18)' }} />
            </div>
          </>
        )}

        {/* Stars — dark mode only */}
        <svg
          className="absolute inset-0 w-full h-full opacity-0 dark:opacity-100 transition-opacity duration-700"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {STARS.map((s, i) => (
            <circle key={i} cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r} fill="white" opacity={s.opacity} />
          ))}
        </svg>
      </div>

      {/* ── Noise / film grain overlay ── */}
      <svg
        aria-hidden
        className="pointer-events-none fixed inset-0 w-full h-full z-50 opacity-[0.028]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="costudy-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#costudy-grain)" />
      </svg>

      {children}
    </div>
  )
}