'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'
import { LayoutGrid, Users, Settings, Sun, Moon, ChevronLeft, X } from 'lucide-react'

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
          active={pathname.startsWith('/settings')}
          collapsed={collapsed}
          href="/settings"
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

        <div
          title={collapsed ? (profile?.username ?? '') : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
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
        </div>
      </div>
    </aside>
  )
}
