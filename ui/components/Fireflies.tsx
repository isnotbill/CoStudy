'use client'

import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'

function sr(seed: number) {
  const s = Math.sin(seed * 9301 + 49297) * 233280
  return s - Math.floor(s)
}

type Fly = {
  left:  number
  top:   number
  size:  number
  dx:    number
  dy:    number
  dur:   number
}

const FLIES: Fly[] = Array.from({ length: 14 }, (_, i) => ({
  left:  +(sr(i * 3)     * 90 + 4).toFixed(1),
  top:   +(sr(i * 3 + 1) * 75 + 15).toFixed(1),
  size:  +(2.5 + sr(i * 3 + 2) * 3).toFixed(1),
  dx:    +((sr(i * 7)     - 0.5) * 160).toFixed(0),
  dy:    +((sr(i * 7 + 1) - 0.5) * 110).toFixed(0),
  dur:   +(6 + sr(i * 5) * 10).toFixed(1),
}))

// Individual firefly — handles rise-then-float sequence
function FireflyDot({ f, index }: { f: Fly; index: number }) {
  const controls  = useAnimation()
  const riseDelay = index * 0.08 + 0.1

  useEffect(() => {
    async function sequence() {
      // Phase 1: rise from below the screen into position
      await controls.start({
        y:       0,
        opacity: 0.65,
        transition: {
          duration: 1.3 + f.dur * 0.07,
          delay:    riseDelay,
          ease:     [0.16, 1, 0.3, 1],
        },
      })

      // Phase 2: organic float loop — seamless handoff, no jump
      controls.start({
        x:       [0, f.dx * 0.35, f.dx, f.dx * 0.55, -f.dx * 0.25, f.dx * 0.7, 0],
        y:       [0, -f.dy * 0.4, f.dy * 0.25, -f.dy, f.dy * 0.5, -f.dy * 0.3, 0],
        opacity: [0.08, 0.82, 0.18, 0.95, 0.32, 0.72, 0.08],
        scale:   [0.78, 1.08, 0.85, 1.2, 0.9, 1.04, 0.78],
        transition: {
          duration: f.dur,
          repeat:   Infinity,
          ease:     'easeInOut',
        },
      })
    }
    sequence()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      animate={controls}
      initial={{ y: 900, opacity: 0 }}
      style={{
        position: 'absolute',
        left:     `${f.left}%`,
        top:      `${f.top}%`,
        width:    f.size,
        height:   f.size,
        borderRadius: '50%',
        background: 'rgba(255, 236, 84, 0.95)',
        boxShadow: [
          `0 0 ${f.size * 2}px ${f.size}px rgba(251,191,36,0.6)`,
          `0 0 ${f.size * 5}px ${f.size * 2.5}px rgba(245,158,11,0.28)`,
          `0 0 ${f.size * 10}px ${f.size * 5}px rgba(217,119,6,0.12)`,
        ].join(', '),
      }}
    />
  )
}

export function Fireflies() {
  const { theme }   = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted || theme !== 'dark') return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {FLIES.map((f, i) => (
        <FireflyDot key={i} f={f} index={i} />
      ))}
    </div>
  )
}
