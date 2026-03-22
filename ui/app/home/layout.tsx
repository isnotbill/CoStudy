'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Sun, Moon } from 'lucide-react'
import { PageBackground } from '@/components/PageBackground'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { useTheme } from '@/components/ThemeProvider'
import apiClient from '@/lib/apiClient'

interface Profile {
  username: string
  image?: string | null
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { theme, toggle } = useTheme()

  const [profile,    setProfile]    = useState<Profile | null>(null)
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/user', { signal: controller.signal })
      .then(res => setProfile(res.data))
      .catch(err => { if (err?.code !== 'ERR_CANCELED') router.replace('/login') })
    return () => controller.abort()
  }, [router])

  const avatarSrc = profile?.image
    ? `https://costudy-images-bucket.s3.ca-central-1.amazonaws.com/${profile.image}?t=${Date.now()}`
    : 'https://api.costudy.online/avatars/default-avatar.png'

  return (
    <PageBackground>
      <div className="flex h-screen overflow-hidden">

        <DashboardSidebar
          profile={profile}
          avatarSrc={avatarSrc}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(c => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {mobileOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center gap-3 px-4 h-[65px] shrink-0 border-b border-border">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-lg text-body hover:text-heading
                hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="font-cedarville text-[22px] text-indigo-700 dark:text-indigo-200
              dark:drop-shadow-[0_0_18px_rgba(165,180,252,0.4)]">
              costudy
            </span>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="ml-auto p-2 rounded-lg text-body hover:text-heading
                hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          <main className="flex-1 overflow-y-auto relative z-10 p-6 pb-16">
            {children}
          </main>

        </div>
      </div>
    </PageBackground>
  )
}
