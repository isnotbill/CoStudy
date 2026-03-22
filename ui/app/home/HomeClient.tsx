'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import apiClient from '@/lib/apiClient'
import { PageBackground } from '@/components/PageBackground'
import { HomeNavbar } from '@/components/HomeNavbar'

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
  onlineCount: number
}

interface PublicRoom {
  id: number
  code: string
  roomName: string
  hostName: string
  members: number
  onlineCount: number
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
  Pomodoro: { name: '', publicRoom: false, studyTimeMs: 25, shortBreakTimeMs: 5, longBreakTimeMs: 15, cyclesTillLongBreak: 4 },
  '52/17':  { name: '', publicRoom: false, studyTimeMs: 52, shortBreakTimeMs: 17, longBreakTimeMs: 30, cyclesTillLongBreak: 4 },
  Ultradian:{ name: '', publicRoom: false, studyTimeMs: 90, shortBreakTimeMs: 20, longBreakTimeMs: 60, cyclesTillLongBreak: 3 },
}

// ─── Shared input style ───────────────────────────────────────────────────────

const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
  bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400/70
  focus:outline-none focus:ring-2 focus:ring-indigo-400/35 focus:border-indigo-300
  dark:bg-white/[0.055] dark:border-white/[0.09] dark:text-white/85
  dark:placeholder:text-white/18 dark:focus:ring-indigo-400/25 dark:focus:border-indigo-400/40`

const labelCls = `block text-[11px] font-semibold tracking-wide uppercase mb-1.5
  text-gray-500 dark:text-white/38`

const numInputCls = `w-full px-3 py-2 rounded-xl text-sm text-center transition-all duration-200
  bg-white border border-gray-200 text-gray-900
  focus:outline-none focus:ring-2 focus:ring-indigo-400/35 focus:border-indigo-300
  dark:bg-white/[0.055] dark:border-white/[0.09] dark:text-white/85
  dark:focus:ring-indigo-400/25 dark:focus:border-indigo-400/40`

// ─── Create Room Panel ────────────────────────────────────────────────────────

function CreatePanel({ username }: { username: string }) {
  const router = useRouter()
  const [settings, setSettings] = useState<SettingsDto>({ ...PRESETS.Pomodoro, name: `${username}'s room` })
  const [active, setActive]     = useState<string>('Pomodoro')
  const [privacy, setPrivacy]   = useState<'private' | 'public'>('private')
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [loading, setLoading]   = useState(false)

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
      const e = err as { response?: { status: number; data?: { data?: Record<string,string>; message?: string } } }
      if (e.response?.status === 400) {
        const d = e.response.data?.data
        setErrors(d && typeof d === 'object' && !Array.isArray(d) ? d : { general: 'Invalid input' })
      } else {
        setErrors({ general: e.response?.data?.message ?? 'Something went wrong' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
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
                ? 'bg-white dark:bg-white/[0.1] text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'
              }`}
          >
            {key}
          </button>
        ))}
        <button
          onClick={() => setActive('Custom')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
            ${active === 'Custom'
              ? 'bg-white dark:bg-white/[0.1] text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'
            }`}
        >
          Custom
        </button>
      </div>

      {/* Timer fields */}
      <div className="grid grid-cols-2 gap-3">
        {([
          { label: 'Study (min)',       key: 'studyTimeMs'        },
          { label: 'Short break (min)', key: 'shortBreakTimeMs'   },
          { label: 'Long break (min)',  key: 'longBreakTimeMs'    },
          { label: 'Cycles → long',     key: 'cyclesTillLongBreak'},
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
            <span className="text-sm capitalize text-gray-600 dark:text-white/55">{opt}</span>
          </label>
        ))}
      </div>

      {errors.general && <p className="text-xs text-red-500 dark:text-red-400">{errors.general}</p>}

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
          bg-indigo-600 text-white hover:bg-indigo-500
          shadow-sm dark:shadow-[0_0_28px_rgba(99,102,241,0.32)]
          dark:hover:shadow-[0_0_42px_rgba(99,102,241,0.5)]
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating…' : 'Create Room'}
      </button>
    </div>
  )
}

// ─── Join Room Panel ──────────────────────────────────────────────────────────

function JoinPanel({ username }: { username: string }) {
  const router = useRouter()
  const [code,         setCode]         = useState('')
  const [errorMsg,     setErrorMsg]     = useState('')
  const [search,       setSearch]       = useState('')
  const [publicRooms,  setPublicRooms]  = useState<PublicRoom[]>([])
  const [joining,      setJoining]      = useState<string | null>(null)

  useEffect(() => {
    apiClient
      .get(`/room/public?page=0&size=10&keyword=${search}`)
      .then(res => setPublicRooms(res.data._embedded?.publicRoomDtoList ?? []))
      .catch(() => {})
  }, [search])

  async function joinRoom(roomCode: string) {
    setJoining(roomCode)
    setErrorMsg('')
    try {
      await apiClient.post(`/room/${roomCode}/join`)
      router.push(`/room/${roomCode}`)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setErrorMsg(e.response?.data?.message ?? 'Failed to join room')
      setJoining(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Direct code entry */}
      <div>
        <label className={labelCls}>Room Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setErrorMsg('') }}
            onKeyDown={e => { if (e.key === 'Enter') joinRoom(code) }}
            placeholder="XXXXXX"
            className={inputCls + ' font-mono tracking-widest uppercase'}
          />
          <button
            onClick={() => joinRoom(code)}
            disabled={!code || !!joining}
            className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Join
          </button>
        </div>
        {errorMsg && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errorMsg}</p>}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-black/[0.07] dark:bg-white/[0.07]" />
        <span className="text-[11px] text-gray-400 dark:text-white/25">or browse public rooms</span>
        <div className="flex-1 h-px bg-black/[0.07] dark:bg-white/[0.07]" />
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search rooms…"
          className={inputCls + ' pl-9'}
        />
      </div>

      {/* Public room list */}
      <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-0.5
        [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10">
        {publicRooms
          .filter(r => r.hostName !== username)
          .map(room => (
            <button
              key={room.id}
              onClick={() => joinRoom(room.code)}
              disabled={!!joining}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left
                transition-all duration-150 disabled:opacity-50
                bg-black/[0.03] hover:bg-indigo-50 border border-black/[0.05]
                dark:bg-white/[0.03] dark:hover:bg-indigo-500/10 dark:border-white/[0.05]"
            >
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/80">{room.roomName}</p>
                <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5 flex items-center gap-1.5">
                  {room.members} member{room.members !== 1 ? 's' : ''} · host: {room.hostName}
                  {room.onlineCount > 0 && (
                    <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
                      · <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 inline-block" />{room.onlineCount} online
                    </span>
                  )}
                </p>
              </div>
              <span className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">
                {joining === room.code ? '…' : 'Join →'}
              </span>
            </button>
          ))}
        {publicRooms.filter(r => r.hostName !== username).length === 0 && (
          <p className="text-xs text-center text-gray-400 dark:text-white/25 py-4">No public rooms found.</p>
        )}
      </div>
    </div>
  )
}

// ─── User Rooms Panel ─────────────────────────────────────────────────────────

function MyRooms() {
  const router   = useRouter()
  const [rooms,   setRooms]   = useState<Room[]>([])
  const [search,  setSearch]  = useState('')
  const [confirm, setConfirm] = useState<Room | null>(null)

  useEffect(() => {
    apiClient.get('/rooms')
      .then(res => setRooms(res.data.data ?? []))
      .catch(() => {})
  }, [])

  function deleteRoom(roomId: number) {
    apiClient.delete(`/room/${roomId}/delete`)
      .then(() => setRooms(prev => prev.filter(r => r.roomId !== roomId)))
      .catch(() => {})
  }

  function leaveRoom(code: string) {
    apiClient.delete(`/room/${code}/leave`)
      .then(() => setRooms(prev => prev.filter(r => r.code !== code)))
      .catch(() => {})
  }

  const filtered = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter rooms…"
          className={inputCls + ' pl-9'}
        />
      </div>

      {/* Room list */}
      <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-0.5
        [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10">
        {filtered.map(room => (
          <div
            key={room.roomId}
            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
              transition-all duration-150 group
              bg-black/[0.025] hover:bg-indigo-50 border border-black/[0.05]
              dark:bg-white/[0.03] dark:hover:bg-indigo-500/[0.08] dark:border-white/[0.05]"
            onClick={async () => {
              await apiClient.get('/refresh-token').catch(() => {})
              router.push(`/room/${room.code}`)
            }}
          >
            {/* Admin/member indicator */}
            <div className={`w-1 h-10 rounded-full shrink-0 ${room.admin ? 'bg-amber-400' : 'bg-indigo-400/60'}`} />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white/80 truncate">{room.name}</p>
              <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5 flex items-center gap-1.5">
                {room.members} member{room.members !== 1 ? 's' : ''}
                {room.admin && <span className="text-amber-500 dark:text-amber-400">· admin</span>}
                {room.onlineCount > 0 && (
                  <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
                    · <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 inline-block" />{room.onlineCount} online
                  </span>
                )}
              </p>
            </div>

            {/* Remove button */}
            <button
              onClick={e => { e.stopPropagation(); setConfirm(room) }}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full
                text-gray-400 hover:text-red-500 hover:bg-red-50
                dark:text-white/25 dark:hover:text-red-400 dark:hover:bg-red-400/10
                transition-all duration-150 opacity-0 group-hover:opacity-100"
              title={room.admin ? 'Delete room' : 'Leave room'}
            >
              ×
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-xs text-center text-gray-400 dark:text-white/25 py-4">No rooms yet.</p>
        )}
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm mx-4 rounded-2xl p-6 backdrop-blur-xl
                bg-white/90 border border-black/[0.07] shadow-[0_4px_28px_rgba(0,0,0,0.12)]
                dark:bg-[#0d1120]/95 dark:border-white/[0.09]"
            >
              <p className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                {confirm.admin ? 'Delete' : 'Leave'} &ldquo;{confirm.name}&rdquo;?
              </p>
              {confirm.admin && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
                  This room and all its data will be permanently deleted.
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setConfirm(null)}
                  className="flex-1 py-2 rounded-xl text-sm transition-all duration-200
                    bg-black/[0.04] text-gray-600 hover:bg-black/[0.07]
                    dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirm.admin ? deleteRoom(confirm.roomId) : leaveRoom(confirm.code)
                    setConfirm(null)
                  }}
                  className="flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    bg-red-500 text-white hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const } }),
}

export default function HomeClient() {
  const router       = useRouter()
  const params       = useSearchParams()
  const reason       = params.get('reason')
  const invalidCode  = params.get('code')

  const [profile, setProfile] = useState<Profile | null>(null)
  const [tab, setTab]         = useState<'create' | 'join'>('create')

  useEffect(() => {
    apiClient.get('/user')
      .then(res => setProfile(res.data))
      .catch(() => { router.replace('/login') })
  }, [router])

  const avatarSrc = profile?.image
    ? `https://costudy-images-bucket.s3.ca-central-1.amazonaws.com/${profile.image}?t=${Date.now()}`
    : 'https://api.costudy.online/avatars/default-avatar.png'

  return (
    <PageBackground>
      <HomeNavbar profile={profile} avatarSrc={avatarSrc} />

      <main className="relative z-10 px-4 pb-16 pt-4 max-w-6xl mx-auto">
        {/* Greeting */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={profile ? 'show' : 'hidden'}
          className="mb-8"
        >
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-1
            text-indigo-500/55 dark:text-indigo-300/50">
            welcome back
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white/85">
            {profile?.username ?? '…'}
          </h1>
        </motion.div>

        {/* Error banner */}
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

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left — Join / Create */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate={profile ? 'show' : 'hidden'}>
            <div className="rounded-2xl p-6 backdrop-blur-xl
              bg-white/85 border border-black/[0.07] shadow-[0_4px_28px_rgba(0,0,0,0.07)]
              dark:bg-white/[0.05] dark:border-white/[0.09]
              dark:shadow-[0_0_50px_rgba(99,102,241,0.08),_0_0_0_1px_rgba(255,255,255,0.04)]">

              {/* Tab bar */}
              <div className="flex gap-1 p-1 mb-5 rounded-xl bg-black/[0.04] dark:bg-white/[0.04]
                border border-black/[0.06] dark:border-white/[0.06]">
                {(['create', 'join'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                      ${tab === t
                        ? 'bg-white dark:bg-white/[0.1] text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'
                      }`}
                  >
                    {t === 'create' ? 'Host Room' : 'Join Room'}
                  </button>
                ))}
              </div>

              {profile && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    {tab === 'create'
                      ? <CreatePanel username={profile.username} />
                      : <JoinPanel username={profile.username} />
                    }
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          {/* Right — My Rooms */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate={profile ? 'show' : 'hidden'}>
            <div className="rounded-2xl p-6 backdrop-blur-xl h-full
              bg-white/85 border border-black/[0.07] shadow-[0_4px_28px_rgba(0,0,0,0.07)]
              dark:bg-white/[0.05] dark:border-white/[0.09]
              dark:shadow-[0_0_50px_rgba(99,102,241,0.08),_0_0_0_1px_rgba(255,255,255,0.04)]">

              <h2 className="text-[1rem] font-semibold mb-4 text-gray-900 dark:text-white/85">My Rooms</h2>
              <MyRooms />
            </div>
          </motion.div>
        </div>
      </main>
    </PageBackground>
  )
}
