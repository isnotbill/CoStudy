'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'
import { LayoutGrid, Users, Settings, Sun, Moon, ChevronLeft, X, LogOut } from 'lucide-react'
import apiClient from '@/lib/apiClient'

// ─── Nav item ─────────────────────────────────────────────────────────────────

function NavItem({
  icon, label, active, collapsed, href, onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  collapsed: boolean
  href?: string
  onClick?: () => void
}) {
  const cls = `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
    transition-all duration-200 text-left
    ${active
      ? 'bg-indigo-500/10 text-link dark:bg-indigo-400/15'
      : 'text-body hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-heading'
    }
    ${collapsed ? 'justify-center' : ''}`

  const content = (
    <>
      <span className={`shrink-0 ${active ? 'text-link' : ''}`}>{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cls} title={collapsed ? label : undefined} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} title={collapsed ? label : undefined} className={cls}>
      {content}
    </button>
  )
}

// ─── User card with logout popover ────────────────────────────────────────────

function UserCard({
  profile, avatarSrc, collapsed,
}: {
  profile: Props['profile']
  avatarSrc: string
  collapsed: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await apiClient.post('/logout')
      router.replace('/login')
    } catch { /* ignore */ }
    finally { setLoggingOut(false) }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        title={collapsed ? (profile?.username ?? '') : undefined}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
          transition-all duration-200 cursor-pointer
          hover:bg-black/[0.04] dark:hover:bg-white/[0.05]
          ${collapsed ? 'justify-center' : ''}`}
      >
        <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-indigo-400/25 shrink-0">
          {profile ? (
            <Image
              src={avatarSrc}
              alt={profile.username}
              width={28}
              height={28}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-indigo-400/20" />
          )}
        </div>
        {!collapsed && (
          <span className="text-sm font-medium text-heading truncate">
            {profile?.username ?? '…'}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute bottom-full mb-2 z-50
              rounded-xl border border-border bg-white dark:bg-zinc-900 shadow-lg
              overflow-hidden
              ${collapsed ? 'left-1/2 -translate-x-1/2 w-40' : 'left-0 right-0'}`}
          >
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium
                text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-400/10
                transition-colors disabled:opacity-50"
            >
              <LogOut size={15} />
              {loggingOut ? 'Logging out…' : 'Log out'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  profile: { username: string; image?: string | null } | null
  avatarSrc: string
  collapsed: boolean
  onCollapse: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function DashboardSidebar({
  profile, avatarSrc,
  collapsed, onCollapse, mobileOpen, onMobileClose,
}: Props) {
  const { theme, toggle } = useTheme()
  const pathname = usePathname()

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 flex flex-col
        bg-card-bg border-r border-border backdrop-blur-xl
        transition-[width,transform] duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-56'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:inset-auto
      `}
    >
      {/* ── Logo + collapse toggle ── */}
      <div className={`flex items-center h-[65px] px-3 shrink-0 border-b border-border
        ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Link
            href="/home/rooms"
            className="font-cedarville text-[22px] tracking-wide select-none
              text-indigo-700 dark:text-indigo-200
              dark:drop-shadow-[0_0_18px_rgba(165,180,252,0.4)]
              hover:opacity-75 transition-opacity duration-200"
            onClick={onMobileClose}
          >
            costudy
          </Link>
        )}
        <button
          onClick={onCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex p-2 rounded-lg transition-colors duration-200
            text-body hover:text-heading hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
        >
          <ChevronLeft size={16} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={onMobileClose}
          className="flex lg:hidden p-2 rounded-lg ml-auto transition-colors duration-200
            text-body hover:text-heading hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        <NavItem
          icon={<LayoutGrid size={18} />}
          label="Rooms"
          active={pathname.startsWith('/home/rooms')}
          collapsed={collapsed}
          href="/home/rooms"
          onClick={onMobileClose}
        />
        <NavItem
          icon={<Users size={18} />}
          label="Friends"
          active={pathname.startsWith('/home/friends')}
          collapsed={collapsed}
          href="/home/friends"
          onClick={onMobileClose}
        />
        <NavItem
          icon={<Settings size={18} />}
          label="Settings"
          active={pathname.startsWith('/home/settings')}
          collapsed={collapsed}
          href="/home/settings"
          onClick={onMobileClose}
        />
      </nav>

      {/* ── Bottom: theme toggle + user card ── */}
      <div className="shrink-0 px-2 py-3 border-t border-border flex flex-col gap-1">
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          title={collapsed ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : undefined}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm
            transition-all duration-200
            text-body hover:text-heading hover:bg-black/[0.04] dark:hover:bg-white/[0.06]
            ${collapsed ? 'justify-center' : ''}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 15, scale: 0.8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="shrink-0 block"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </motion.span>
          </AnimatePresence>
          {!collapsed && (
            <span className="truncate">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          )}
        </button>

        <UserCard profile={profile} avatarSrc={avatarSrc} collapsed={collapsed} />
      </div>
    </aside>
  )
}
