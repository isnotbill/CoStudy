'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Sun, Moon } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { PageBackground } from '@/components/PageBackground'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { useTheme } from '@/components/ThemeProvider'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  username: string
  image?: string | null
}

interface Room {
  roomId: number
  name: string
  code: string
  admin: boolean
  members: number
}

interface SettingsDto {
  name: string
  publicRoom: boolean
  studyTimeMs: number
  shortBreakTimeMs: number
  longBreakTimeMs: number
  cyclesTillLongBreak: number
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS: Record<string, SettingsDto> = {
  Pomodoro:  { name: '', publicRoom: false, studyTimeMs: 25, shortBreakTimeMs: 5,  longBreakTimeMs: 15, cyclesTillLongBreak: 4 },
  '52/17':   { name: '', publicRoom: false, studyTimeMs: 52, shortBreakTimeMs: 17, longBreakTimeMs: 30, cyclesTillLongBreak: 4 },
  Ultradian: { name: '', publicRoom: false, studyTimeMs: 90, shortBreakTimeMs: 20, longBreakTimeMs: 60, cyclesTillLongBreak: 3 },
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
  bg-input-bg border border-input-border text-input-fg placeholder:text-placeholder
  focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring-border`

const labelCls = `block text-[11px] font-semibold tracking-wide uppercase mb-1.5 text-body`

const numInputCls = `w-full px-3 py-2 rounded-xl text-sm text-center transition-all duration-200
  bg-input-bg border border-input-border text-input-fg
  focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring-border`

// ─── Room accent colors (deterministic from name) ─────────────────────────────

const ACCENTS = [
  { bg: 'bg-indigo-500/[0.12]',  text: 'text-indigo-600  dark:text-indigo-300'  },
  { bg: 'bg-violet-500/[0.12]',  text: 'text-violet-600  dark:text-violet-300'  },
  { bg: 'bg-blue-500/[0.12]',    text: 'text-blue-600    dark:text-blue-300'    },
  { bg: 'bg-emerald-500/[0.12]', text: 'text-emerald-600 dark:text-emerald-300' },
  { bg: 'bg-amber-500/[0.12]',   text: 'text-amber-600   dark:text-amber-300'   },
  { bg: 'bg-rose-500/[0.12]',    text: 'text-rose-600    dark:text-rose-300'    },
]

function roomAccent(name: string) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return ACCENTS[h % ACCENTS.length]
}

function roomInitials(name: string) {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

// ─── Room Card ────────────────────────────────────────────────────────────────

function RoomCard({ room, onRemove }: { room: Room; onRemove: (room: Room) => void }) {
  const router = useRouter()
  const accent = roomAccent(room.name) // used for Enter → color

  async function enter() {
    await apiClient.get('/refresh-token').catch(() => {})
    router.push(`/room/${room.code}`)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-2xl border border-border
        bg-card-bg backdrop-blur-xl cursor-pointer overflow-hidden
        shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]
        hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]
        hover:-translate-y-0.5 transition-all duration-200"
      onClick={enter}
    >
      <div className="flex flex-col gap-3 p-5">
        {/* Name + remove button */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-heading truncate leading-snug">{room.name}</p>
            <p className="text-xs text-body mt-0.5">
              {room.members} member{room.members !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onRemove(room) }}
            title={room.admin ? 'Delete room' : 'Leave room'}
            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center
              rounded-full text-body hover:text-red-500 hover:bg-red-50
              dark:hover:text-red-400 dark:hover:bg-red-400/10
              transition-all duration-150 text-base leading-none shrink-0"
          >
            ×
          </button>
        </div>

        {/* Footer: code + role + enter */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-faint tracking-wider">{room.code}</span>
            {room.admin && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md
                bg-amber-400/15 text-amber-600 dark:text-amber-400">
                admin
              </span>
            )}
          </div>
          <span className={`text-xs font-medium ${accent.text}
            opacity-0 group-hover:opacity-100 transition-opacity duration-150`}>
            Enter →
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Join Bar ─────────────────────────────────────────────────────────────────

function JoinBar({ onHost }: { onHost: () => void }) {
  const router = useRouter()
  const [code,    setCode]    = useState('')
  const [error,   setError]   = useState('')
  const [joining, setJoining] = useState(false)

  async function join() {
    if (!code.trim()) return
    setJoining(true)
    setError('')
    try {
      await apiClient.post(`/room/${code}/join`)
      router.push(`/room/${code}`)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e.response?.data?.message ?? 'Room not found')
      setJoining(false)
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
            onKeyDown={e => { if (e.key === 'Enter') join() }}
            placeholder="Enter room code…"
            className={`${inputCls} font-mono tracking-widest uppercase max-w-xs`}
          />
          <button
            onClick={join}
            disabled={!code.trim() || joining}
            className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200
              bg-indigo-600 text-white hover:bg-indigo-500
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {joining ? '…' : 'Join'}
          </button>
        </div>
        <button
          onClick={onHost}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold
            transition-colors duration-200 bg-indigo-600 text-white hover:bg-indigo-500"
        >
          <span className="text-base leading-none">+</span>
          Host
        </button>
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">{error}</p>}
    </div>
  )
}

// ─── Create Room Modal ────────────────────────────────────────────────────────

function CreateRoomModal({ open, onClose, username }: { open: boolean; onClose: () => void; username: string }) {
  const router = useRouter()
  const [settings, setSettings] = useState<SettingsDto>({ ...PRESETS.Pomodoro, name: `${username}'s room` })
  const [active,   setActive]   = useState('Pomodoro')
  const [privacy,  setPrivacy]  = useState<'private' | 'public'>('private')
  const [errors,   setErrors]   = useState<Record<string, string>>({})
  const [loading,  setLoading]  = useState(false)

  const blockInvalid = (e: React.KeyboardEvent) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault()
  }

  async function handleCreate() {
    setLoading(true)
    setErrors({})
    try {
      const res = await apiClient.post('/room/create', settings)
      router.push(`/room/${res.data.data}`)
    } catch (err: unknown) {
      const e = err as { response?: { status: number; data?: { data?: Record<string, string>; message?: string } } }
      if (e.response?.status === 400) {
        const d = e.response.data?.data
        setErrors(d && typeof d === 'object' && !Array.isArray(d) ? d : { general: 'Invalid input' })
      } else {
        setErrors({ general: e.response?.data?.message ?? 'Something went wrong' })
      }
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl backdrop-blur-xl overflow-hidden
              bg-white/95 border border-border shadow-[0_8px_40px_rgba(0,0,0,0.14)]
              dark:bg-[#0d1120]/98 dark:shadow-[0_8px_40px_rgba(0,0,0,0.5),_0_0_0_1px_rgba(255,255,255,0.06)]"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
              <h2 className="text-sm font-semibold text-heading">Host a Room</h2>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full text-body
                  hover:text-heading hover:bg-black/[0.05] dark:hover:bg-white/[0.08]
                  transition-colors text-base leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Room name */}
              <div>
                <label className={labelCls}>Room name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={e => { setSettings(s => ({ ...s, name: e.target.value })); setErrors(er => ({ ...er, name: '' })) }}
                  className={inputCls}
                  placeholder="My study room"
                />
                {errors.name && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Preset tabs */}
              <div className="flex gap-1 p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06]">
                {Object.keys(PRESETS).map(key => (
                  <button
                    key={key}
                    onClick={() => { setActive(key); setSettings({ ...PRESETS[key], name: settings.name, publicRoom: settings.publicRoom }) }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                      ${active === key
                        ? 'bg-white dark:bg-white/[0.1] text-link shadow-sm'
                        : 'text-body hover:text-heading'
                      }`}
                  >
                    {key}
                  </button>
                ))}
                <button
                  onClick={() => setActive('Custom')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                    ${active === 'Custom'
                      ? 'bg-white dark:bg-white/[0.1] text-link shadow-sm'
                      : 'text-body hover:text-heading'
                    }`}
                >
                  Custom
                </button>
              </div>

              {/* Timer fields */}
              <div className="grid grid-cols-2 gap-3">
                {([
                  { label: 'Study (min)',       key: 'studyTimeMs'         },
                  { label: 'Short break (min)', key: 'shortBreakTimeMs'    },
                  { label: 'Long break (min)',  key: 'longBreakTimeMs'     },
                  { label: 'Cycles → long',     key: 'cyclesTillLongBreak' },
                ] as { label: string; key: keyof SettingsDto }[]).map(({ label, key }) => (
                  <div key={key}>
                    <label className={labelCls}>{label}</label>
                    <input
                      type="number"
                      value={settings[key] as number}
                      onChange={e => { setSettings(s => ({ ...s, [key]: parseInt(e.target.value) || 0 })); setActive('Custom') }}
                      onKeyDown={blockInvalid}
                      className={numInputCls}
                    />
                    {errors[key] && <p className="text-xs text-red-500 mt-0.5">{errors[key]}</p>}
                  </div>
                ))}
              </div>

              {/* Privacy */}
              <div className="flex gap-4">
                {(['private', 'public'] as const).map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy === opt}
                      onChange={() => { setPrivacy(opt); setSettings(s => ({ ...s, publicRoom: opt === 'public' })) }}
                      className="w-4 h-4 rounded border-gray-300 dark:border-white/20 accent-indigo-500"
                    />
                    <span className="text-sm capitalize text-muted">{opt}</span>
                  </label>
                ))}
              </div>

              {errors.general && <p className="text-xs text-red-500 dark:text-red-400">{errors.general}</p>}

              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200
                  bg-indigo-600 text-white hover:bg-indigo-500
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating…' : 'Create Room'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Confirm modal ────────────────────────────────────────────────────────────

function ConfirmModal({
  room, onCancel, onConfirm,
}: { room: Room | null; onCancel: () => void; onConfirm: (room: Room) => void }) {
  return (
    <AnimatePresence>
      {room && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl p-6 backdrop-blur-xl
              bg-white/90 border border-border shadow-[0_4px_28px_rgba(0,0,0,0.12)]
              dark:bg-[#0d1120]/95"
          >
            <p className="text-sm font-medium text-heading mb-1">
              {room.admin ? 'Delete' : 'Leave'} &ldquo;{room.name}&rdquo;?
            </p>
            {room.admin && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                This room and all its data will be permanently deleted.
              </p>
            )}
            <div className="flex gap-2 mt-5">
              <button
                onClick={onCancel}
                className="flex-1 py-2 rounded-xl text-sm transition-colors duration-200
                  bg-black/[0.04] text-subtle hover:bg-black/[0.07]
                  dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(room)}
                className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors duration-200
                  bg-red-500 text-white hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Rooms tab ────────────────────────────────────────────────────────────────

function RoomsContent({ profile, reason, invalidCode }: {
  profile: Profile | null
  reason: string | null
  invalidCode: string | null
}) {
  const [rooms,      setRooms]      = useState<Room[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [confirm,    setConfirm]    = useState<Room | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/rooms', { signal: controller.signal })
      .then(res => setRooms(res.data.data ?? []))
      .catch(err => { if (err?.code !== 'ERR_CANCELED') console.error(err) })
    return () => controller.abort()
  }, [])

  function handleRemove(room: Room) {
    if (room.admin) {
      apiClient.delete(`/room/${room.roomId}/delete`)
        .then(() => setRooms(prev => prev.filter(r => r.roomId !== room.roomId)))
        .catch(() => {})
    } else {
      apiClient.delete(`/room/${room.code}/leave`)
        .then(() => setRooms(prev => prev.filter(r => r.code !== room.code)))
        .catch(() => {})
    }
    setConfirm(null)
  }

  return (
    <>
      {/* Invalid code banner */}
      <AnimatePresence>
        {reason === 'invalid_room_code' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mb-5 px-4 py-2.5 rounded-xl text-xs overflow-hidden
              bg-red-50 border border-red-200 text-red-600
              dark:bg-red-400/10 dark:border-red-400/20 dark:text-red-300"
          >
            No room matches code &ldquo;<span className="font-semibold">{invalidCode}</span>&rdquo;. Double-check and try again.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <h1 className="text-2xl font-bold text-heading mb-4">Your Rooms</h1>

      {/* Join bar + Host button */}
      <JoinBar onHost={() => setShowCreate(true)} />

      {/* Room grid */}
      {rooms.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {rooms.map(room => (
              <RoomCard
                key={room.roomId}
                room={room}
                onRemove={setConfirm}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : profile ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-3xl select-none">🚪</p>
          <p className="text-sm font-medium text-heading">No rooms yet</p>
          <p className="text-sm text-body">Host a room or join one with a code above.</p>
        </div>
      ) : null}

      {/* Modals */}
      {profile && (
        <CreateRoomModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          username={profile.username}
        />
      )}
      <ConfirmModal
        room={confirm}
        onCancel={() => setConfirm(null)}
        onConfirm={handleRemove}
      />
    </>
  )
}

// ─── Friends tab ──────────────────────────────────────────────────────────────

function FriendsContent() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-4xl select-none">👥</p>
      <p className="text-base font-medium text-heading">Friends</p>
      <p className="text-sm text-body">Coming soon.</p>
    </div>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function HomeClient() {
  const router  = useRouter()
  const params  = useSearchParams()
  const { theme, toggle } = useTheme()

  const [profile,    setProfile]    = useState<Profile | null>(null)
  const [activeTab,  setActiveTab]  = useState<'rooms' | 'friends'>('rooms')
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    apiClient.get('/user')
      .then(res => setProfile(res.data))
      .catch(() => router.replace('/login'))
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
          activeTab={activeTab}
          onTabChange={setActiveTab}
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
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {activeTab === 'rooms' && (
                    <RoomsContent
                      profile={profile}
                      reason={params.get('reason')}
                      invalidCode={params.get('code')}
                    />
                  )}
                  {activeTab === 'friends' && <FriendsContent />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

        </div>
      </div>
    </PageBackground>
  )
}
