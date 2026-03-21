'use client'

import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { PageBackground } from '@/components/PageBackground'
import { Fireflies } from '@/components/Fireflies'

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function BouncingDots() {
  return (
    <span className="flex gap-1.5 items-center justify-center h-5">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white block"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.13, ease: 'easeInOut' }}
        />
      ))}
    </span>
  )
}

export default function LoginClient() {
  const params  = useSearchParams()
  const reason  = params.get('reason')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string[] | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form    = new FormData(e.currentTarget as HTMLFormElement)
    const payload = { username: form.get('username'), password: form.get('password') }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        payload,
        { withCredentials: true, timeout: 5000 },
      )
      window.location.href = '/home'
    } catch (err: unknown) {
      setLoading(false)
      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          const body = err.response.data as { success?: boolean; message?: string; data?: string[]; error?: string }
          setError(Array.isArray(body.data) ? body.data : [body.message ?? body.error ?? 'Unexpected error'])
        } else {
          setError([err.message])
        }
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3ece0] dark:bg-[#080b14] transition-colors duration-500">
      <PageBackground />
      <Fireflies />
      <Navbar />

      <main className="relative z-10 flex items-center justify-center px-6 pb-16 pt-4 min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-[380px]"
        >
          <div className="rounded-2xl p-8 backdrop-blur-xl
            bg-white/85 border border-black/[0.07] shadow-[0_4px_28px_rgba(0,0,0,0.07)]
            dark:bg-white/[0.05] dark:border-white/[0.09]
            dark:shadow-[0_0_50px_rgba(99,102,241,0.1),_0_0_0_1px_rgba(255,255,255,0.05)]">

            <div className="text-center mb-7">
              <span className="font-cedarville text-3xl text-indigo-700 dark:text-indigo-200
                dark:drop-shadow-[0_0_22px_rgba(165,180,252,0.45)]">
                costudy
              </span>
              <p className="mt-2 text-sm text-gray-500 dark:text-white/35">Welcome back.</p>
            </div>

            {reason === 'expired_token' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 px-3.5 py-2.5 rounded-xl text-xs
                  bg-amber-50 border border-amber-200 text-amber-700
                  dark:bg-amber-400/10 dark:border-amber-400/20 dark:text-amber-300"
              >
                Your session expired — please sign in again.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5
                  text-gray-500 dark:text-white/38">Username / Email</label>
                <input id="username" name="username" type="text" placeholder="studybuddy" required disabled={loading}
                  className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                    bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400/70
                    focus:outline-none focus:ring-2 focus:ring-indigo-400/35 focus:border-indigo-300 disabled:opacity-50
                    dark:bg-white/[0.055] dark:border-white/[0.09] dark:text-white/85
                    dark:placeholder:text-white/18 dark:focus:ring-indigo-400/25 dark:focus:border-indigo-400/40" />
              </div>

              <div>
                <label htmlFor="password" className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5
                  text-gray-500 dark:text-white/38">Password</label>
                <input id="password" name="password" type="password" placeholder="••••••••" required disabled={loading}
                  className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                    bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400/70
                    focus:outline-none focus:ring-2 focus:ring-indigo-400/35 focus:border-indigo-300 disabled:opacity-50
                    dark:bg-white/[0.055] dark:border-white/[0.09] dark:text-white/85
                    dark:placeholder:text-white/18 dark:focus:ring-indigo-400/25 dark:focus:border-indigo-400/40" />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    {error.map((msg, i) => <p key={i} className="text-xs text-red-500 dark:text-red-400 mt-0.5">{msg}</p>)}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button type="submit" disabled={loading} whileTap={!loading ? { scale: 0.97 } : {}}
                className="relative w-full py-2.5 rounded-xl text-sm font-semibold mt-1
                  bg-indigo-600 text-white transition-colors duration-200 hover:bg-indigo-500
                  shadow-sm dark:shadow-[0_0_28px_rgba(99,102,241,0.32)]
                  dark:hover:shadow-[0_0_42px_rgba(99,102,241,0.5)] disabled:cursor-not-allowed">
                <AnimatePresence mode="wait" initial={false}>
                  {!loading
                    ? <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>Log In</motion.span>
                    : <motion.span key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}><BouncingDots /></motion.span>
                  }
                </AnimatePresence>
              </motion.button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-black/[0.07] dark:bg-white/[0.07]" />
              <span className="text-[11px] text-gray-400 dark:text-white/25">or</span>
              <div className="flex-1 h-px bg-black/[0.07] dark:bg-white/[0.07]" />
            </div>

            <motion.button onClick={() => { window.location.href = 'https://api.costudy.online/oauth2/authorization/google' }}
              whileTap={{ scale: 0.98 }} disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 disabled:opacity-50
                bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm
                dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white/75
                dark:hover:bg-white/[0.07] dark:hover:border-white/[0.13]">
              <GoogleIcon />
              Continue with Google
            </motion.button>

            <p className="text-center text-[13px] mt-5 text-gray-500 dark:text-white/28">
              Don&apos;t have an account?{' '}
              <Link href="/" className="text-indigo-600 dark:text-indigo-300 hover:underline underline-offset-2">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
