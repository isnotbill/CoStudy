'use client'

import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import ReCaptcha from 'react-google-recaptcha'
import { Navbar } from '@/components/Navbar'
import { useTheme } from '@/components/ThemeProvider'

// Seeded pseudo-random — deterministic (no SSR mismatch) but looks truly random
function sr(seed: number) {
  const s = Math.sin(seed * 9301 + 49297) * 233280
  return s - Math.floor(s)
}
const STARS = Array.from({ length: 88 }, (_, i) => ({
  cx: +(sr(i)       * 100).toFixed(1),
  cy: +(sr(i + 100) * 100).toFixed(1),
  r:  sr(i + 200) > 0.92 ? 2.1 : sr(i + 200) > 0.72 ? 1.3 : 0.75,
  opacity: +(0.1 + sr(i + 300) * 0.52).toFixed(2),
}))

const FEATURES = [
  { icon: '🌙', label: 'Pomodoro timer synced with your group' },
  { icon: '💬', label: 'Real-time chat & AI study assistant'   },
  { icon: '🔒', label: 'Private or public study rooms'          },
  { icon: '✨', label: 'Stay focused, together'                 },
]

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: 'easeOut' as const } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09 } },
}

export default function Home() {
  const { theme } = useTheme()
  const [captchaToken, setCaptchaToken] = useState('')
  const [error,        setError]        = useState<string[] | null>(null)
  const [loading,      setLoading]      = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form            = new FormData(e.currentTarget as HTMLFormElement)
    const confirmPassword = form.get('confirm')
    const payload = {
      email:        form.get('email'),
      username:     form.get('username'),
      password:     form.get('password'),
      captchaToken,
    }

    if (payload.password !== confirmPassword) {
      setError(["Passwords don't match!"])
      setLoading(false)
      return
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
        payload,
        { timeout: 5000 },
      )
      window.location.href = '/login'
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          const body = err.response.data as {
            success?: boolean
            message?: string
            data?:    string[]
            error?:   string
          }
          setError(Array.isArray(body.data) ? body.data : [body.message ?? body.error ?? 'Unexpected error'])
        } else {
          setError([err.message])
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3ece0] dark:bg-[#080b14] transition-colors duration-500">

      {/* ── Background layers ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Dark mode — main atmospheric glows */}
        <div className="orb-1 absolute -top-[25%] -left-[12%] w-[65vw] h-[65vw] rounded-full
          bg-indigo-600/[0.13] blur-[150px] opacity-0 dark:opacity-100 transition-opacity duration-700" />
        <div className="orb-2 absolute -bottom-[20%] -right-[8%] w-[50vw] h-[50vw] rounded-full
          bg-violet-700/[0.11] blur-[120px] opacity-0 dark:opacity-100 transition-opacity duration-700" />

        {/* Moon — dark mode only */}
        <div className="absolute top-[7%] right-[16%] opacity-0 dark:opacity-100 transition-opacity duration-700">
          <div className="moon-halo absolute rounded-full pointer-events-none"
            style={{ inset: '-130px', background: 'radial-gradient(circle, rgba(200,212,255,0.1) 0%, rgba(160,175,255,0.04) 50%, transparent 72%)' }} />
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-white/95 to-slate-200/85"
            style={{ boxShadow: '0 0 16px rgba(255,255,255,0.7), 0 0 50px rgba(200,215,255,0.45), 0 0 150px rgba(160,175,255,0.22)' }} />
        </div>

        {/* Sun — light mode only */}
        <div className="absolute top-[5%] right-[14%] opacity-100 dark:opacity-0 transition-opacity duration-700">
          <div className="sun-halo absolute rounded-full pointer-events-none"
            style={{ inset: '-160px', background: 'radial-gradient(circle, rgba(251,191,36,0.16) 0%, rgba(253,186,116,0.07) 45%, transparent 70%)' }} />
          <div className="sun-rays absolute rounded-full pointer-events-none"
            style={{ inset: '-55px', background: 'radial-gradient(circle, transparent 32%, rgba(251,191,36,0.06) 54%, transparent 74%)' }} />
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-yellow-200 to-amber-400"
            style={{ boxShadow: '0 0 22px rgba(251,191,36,0.6), 0 0 60px rgba(253,186,116,0.32), 0 0 160px rgba(253,220,100,0.18)' }} />
        </div>

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

      {/* ── Navigation ── */}
      <Navbar />

      {/* ── Hero ── */}
      <main className="relative z-10 flex items-center justify-center px-6 pb-16 pt-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-10">

          {/* Left — copy */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-xl"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p
              variants={fadeUp}
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-5
                text-indigo-500/55 dark:text-indigo-300/50"
            >
              virtual study rooms
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-[3.6rem] font-bold leading-[1.1] mb-6
                text-gray-900 dark:text-white/88"
            >
              Study Together,{' '}
              <span className="font-cedarville font-normal
                text-indigo-600 dark:text-indigo-300
                dark:drop-shadow-[0_0_45px_rgba(165,180,252,0.5)]">
                Stress&#8209;Free.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base leading-relaxed mb-10
                text-gray-500 dark:text-white/38"
            >
              Join virtual study groups, stay motivated, and collaborate with friends wherever you are.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-3.5">
              {FEATURES.map(({ icon, label }) => (
                <motion.li
                  key={label}
                  variants={fadeUp}
                  className="flex items-center gap-3 justify-center lg:justify-start"
                >
                  <span className="text-base leading-none">{icon}</span>
                  <span className="text-sm text-gray-600 dark:text-white/50">{label}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right — signup card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: 'easeOut' }}
            className="w-full max-w-[390px] shrink-0"
          >
            <div className="rounded-2xl p-8 backdrop-blur-xl
              bg-white/85 border border-black/[0.07] shadow-[0_4px_28px_rgba(0,0,0,0.07)]
              dark:bg-white/[0.05] dark:border-white/[0.09]
              dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">

              <h2 className="text-[1.15rem] font-semibold mb-1
                text-gray-900 dark:text-white/88">
                Create an account
              </h2>
              <p className="text-sm mb-7 text-gray-500 dark:text-white/32">
                Start your first study session today.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {([
                  { name: 'email',    type: 'email',    label: 'Email',            placeholder: 'you@example.com',  min: undefined },
                  { name: 'username', type: 'text',     label: 'Username',         placeholder: 'studybuddy',       min: undefined },
                  { name: 'password', type: 'password', label: 'Password',         placeholder: '••••••••',         min: 8 },
                  { name: 'confirm',  type: 'password', label: 'Confirm Password', placeholder: '••••••••',         min: 8 },
                ] as { name: string; type: string; label: string; placeholder: string; min: number | undefined }[]).map(({ name, type, label, placeholder, min }) => (
                  <div key={name}>
                    <label
                      htmlFor={name}
                      className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5
                        text-gray-500 dark:text-white/38"
                    >
                      {label}
                    </label>
                    <input
                      id={name}
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      required
                      minLength={min}
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                        bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400/70
                        focus:outline-none focus:ring-2 focus:ring-indigo-400/35 focus:border-indigo-300
                        dark:bg-white/[0.055] dark:border-white/[0.09] dark:text-white/85
                        dark:placeholder:text-white/18 dark:focus:ring-indigo-400/25 dark:focus:border-indigo-400/40"
                    />
                  </div>
                ))}

                {error && (
                  <div className="flex flex-col gap-1 pt-0.5">
                    {error.map((msg, i) => (
                      <p key={i} className="text-xs text-red-500 dark:text-red-400">{msg}</p>
                    ))}
                  </div>
                )}

                {/* reCAPTCHA — reset key on theme change so widget re-renders with correct theme */}
                <div className="flex justify-center pt-1">
                  <ReCaptcha
                    key={theme}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    onChange={(token: string | null) => setCaptchaToken(token ?? '')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !captchaToken}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mt-1
                    bg-indigo-600 text-white hover:bg-indigo-500
                    shadow-sm hover:shadow-indigo-200
                    dark:shadow-[0_0_28px_rgba(99,102,241,0.32)]
                    dark:hover:shadow-[0_0_42px_rgba(99,102,241,0.5)]
                    disabled:opacity-40 disabled:cursor-not-allowed
                    disabled:hover:bg-indigo-600 disabled:hover:shadow-sm disabled:dark:hover:shadow-[0_0_28px_rgba(99,102,241,0.32)]"
                >
                  {loading ? 'Creating account…' : 'Get Started'}
                </button>

                <p className="text-center text-[13px] pt-0.5 text-gray-500 dark:text-white/28">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-indigo-600 dark:text-indigo-300
                      hover:underline underline-offset-2"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
