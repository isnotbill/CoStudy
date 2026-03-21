'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'
import { LayoutGrid, Users, Settings, Sun, Moon, ChevronLeft, X } from 'lucide-react'

// ─── Nav item ─────────────────────────────────────────────────────────────────

function NavItem({
  icon, label, active, collapsed, onClick, title,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  collapsed: boolean
  onClick: () => void
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? title ?? label : undefined}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 text-left
        ${active
          ? 'bg-indigo-500/10 text-link dark:bg-indigo-400/15'
          : 'text-body hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-heading'
        }
        ${collapsed ? 'justify-center' : ''}`}
    >
      <span className={`shrink-0 ${active ? 'text-link' : ''}`}>{icon}</span>
      {!collapsed && (
        <span className="truncate">{label}</span>
      )}
    </button>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  profile: { username: string; image?: string | null } | null
  avatarSrc: string
  activeTab: 'rooms' | 'friends'
  onTabChange: (tab: 'rooms' | 'friends') => void
  collapsed: boolean
  onCollapse: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function DashboardSidebar({
  profile, avatarSrc, activeTab, onTabChange,
  collapsed, onCollapse, mobileOpen, onMobileClose,
}: Props) {
  const { theme, toggle } = useTheme()

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
            href="/home"
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
        {/* Mobile close button */}
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
          active={activeTab === 'rooms'}
          collapsed={collapsed}
          onClick={() => { onTabChange('rooms'); onMobileClose() }}
        />
        <NavItem
          icon={<Users size={18} />}
          label="Friends"
          active={activeTab === 'friends'}
          collapsed={collapsed}
          onClick={() => { onTabChange('friends'); onMobileClose() }}
        />

        {/* Settings — navigates to /settings */}
        <Link
          href="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-200
            text-body hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-heading
            ${collapsed ? 'justify-center' : ''}`}
          onClick={onMobileClose}
        >
          <span className="shrink-0"><Settings size={18} /></span>
          {!collapsed && <span className="truncate">Settings</span>}
        </Link>
      </nav>

      {/* ── Bottom: theme toggle + user card ── */}
      <div className="shrink-0 px-2 py-3 border-t border-border flex flex-col gap-1">
        {/* Theme toggle */}
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

        {/* User card */}
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
