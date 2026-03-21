'use client'

import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import ReCaptcha from 'react-google-recaptcha'
import { Navbar } from '@/components/Navbar'
import { PageBackground } from '@/components/PageBackground'
import { useTheme } from '@/components/ThemeProvider'

const FEATURES = [
  { icon: '•', label: 'Pomodoro timer synced with your group' },
  { icon: '•', label: 'Real-time chat & AI study assistant'   },
  { icon: '•', label: 'Private or public study rooms'          },
  { icon: '•', label: 'Stay focused, together'                 },
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
    <PageBackground showCelestial>

      {/* ── Navigation ── */}
      <Navbar />

      {/* ── Hero ── */}
      <main className="relative z-10 flex items-center justify-center px-6 pb-16 pt-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-10">

          {/* Left — copy */}
          <motion.div
            className="text-center lg:text-left max-w-xl"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p
              variants={fadeUp}
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-5
                text-eyebrow"
            >
              virtual study rooms
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-[3.6rem] font-bold leading-[1.1] mb-6
                text-heading"
            >
              Study Together,{' '}
              <span className="font-cedarville font-normal
                text-link
                dark:drop-shadow-[0_0_45px_rgba(165,180,252,0.5)]">
                Stress&#8209;Free.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base leading-relaxed mb-10
                text-body"
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
                  <span className="text-base leading-none text-muted">{icon}</span>
                  <span className="text-sm text-muted">{label}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right — signup card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: 'easeOut' }}
            className="w-full max-w-97.5 shrink-0"
          >
            <div className="rounded-2xl p-8 backdrop-blur-xl
              bg-card-bg border border-border
              shadow-[0_4px_28px_rgba(0,0,0,0.07)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">

              <h2 className="text-[1.15rem] font-semibold mb-1
                text-heading">
                Create an account
              </h2>
              <p className="text-sm mb-7 text-subtle">
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
                        text-body"
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
                        bg-input-bg border border-input-border text-input-fg placeholder:text-placeholder
                        focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring-border"
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
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 mt-1
                    bg-indigo-600 text-white hover:bg-indigo-500
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                >
                  {loading ? 'Creating account…' : 'Get Started'}
                </button>

                <p className="text-center text-[13px] pt-0.5 text-faint">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-link hover:underline underline-offset-2"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </main>
    </PageBackground>
  )
}
