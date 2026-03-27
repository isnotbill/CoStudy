/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import axios from 'axios'
import apiClient from '@/lib/apiClient'
import { PageBackground } from '@/components/PageBackground'
import { HomeNavbar } from '@/components/HomeNavbar'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMsg {
  chatMessageId: number
  roomId: number
  userId: number
  content: string
  sentAt: string
  username: string
  type: 'USER' | 'AI' | 'SERVER'
}

interface Profile {
  username: string
  id: number
  image: string
}

interface RoomUser {
  id: number
  username: string
  image: string
  admin: boolean
}

type TimerPhase  = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'
type TimerStatus = 'RUNNING' | 'PAUSED'

interface TimerDto {
  phase: TimerPhase
  status: TimerStatus
  startedAt: string | null
  durationMs: number
  workCyclesDone: number
}

interface Settings {
  name: string
  publicRoom: boolean
  studyTimeMs: number
  shortBreakTimeMs: number
  longBreakTimeMs: number
  cyclesTillLongBreak: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const remaining = (t: TimerDto) => {
  if (t.status !== 'RUNNING' || !t.startedAt) return t.durationMs
  return Math.max(0, t.durationMs - (Date.now() - new Date(t.startedAt).getTime()))
}

const inputCls = `flex-1 min-w-0 px-4 py-3 rounded-xl text-sm transition-all duration-200
  bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400/70
  focus:outline-none focus:ring-2 focus:ring-indigo-400/35 focus:border-indigo-300
  dark:bg-white/[0.055] dark:border-white/[0.09] dark:text-white/85
  dark:placeholder:text-white/18 dark:focus:ring-indigo-400/25 dark:focus:border-indigo-400/40`

const numInputCls = `w-full px-3 py-2 rounded-xl text-sm text-center transition-all duration-200
  bg-white border border-gray-200 text-gray-900
  focus:outline-none focus:ring-2 focus:ring-indigo-400/35 focus:border-indigo-300
  dark:bg-white/[0.055] dark:border-white/[0.09] dark:text-white/85
  dark:focus:ring-indigo-400/25 dark:focus:border-indigo-400/40`

const labelCls = `block text-[11px] font-semibold tracking-wide uppercase mb-1
  text-gray-500 dark:text-white/38`

const panelCls = `rounded-2xl backdrop-blur-xl
  bg-white/85 border border-black/[0.07] shadow-[0_4px_28px_rgba(0,0,0,0.07)]
  dark:bg-white/[0.05] dark:border-white/[0.09]
  dark:shadow-[0_0_50px_rgba(99,102,241,0.08),_0_0_0_1px_rgba(255,255,255,0.04)]`

const PRESETS: Record<string, Partial<Settings>> = {
  Pomodoro:  { studyTimeMs: 25, shortBreakTimeMs: 5,  longBreakTimeMs: 15, cyclesTillLongBreak: 4 },
  '52/17':   { studyTimeMs: 52, shortBreakTimeMs: 17, longBreakTimeMs: 30, cyclesTillLongBreak: 4 },
  Ultradian: { studyTimeMs: 90, shortBreakTimeMs: 20, longBreakTimeMs: 60, cyclesTillLongBreak: 3 },
}

// ─── Settings Panel ───────────────────────────────────────────────────────────

function SettingsPanel({
  settings, roomId, isAdmin, onClose,
}: {
  settings: Settings | null
  roomId: number | null
  isAdmin: boolean
  onClose: () => void
}) {
  const [val,    setVal]    = useState<Settings | null>(settings)
  const [preset, setPreset] = useState('Custom')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const privacy = val?.publicRoom ? 'public' : 'private'

  useEffect(() => { setVal(settings) }, [settings])

  if (!val) return <p className="text-sm text-gray-400 dark:text-white/30 text-center py-4">Loading…</p>

  const blockInvalid = (e: React.KeyboardEvent) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault()
  }

  async function save() {
    if (!roomId || !val) return
    setSaving(true)
    setErrors({})
    try {
      await apiClient.post(`/settings/update/${roomId}`, val)
      onClose()
    } catch (err: any) {
      const d = err.response?.data
      if (err.response?.status === 400 && d?.data && typeof d.data === 'object' && !Array.isArray(d.data)) {
        setErrors(d.data)
      } else {
        setErrors({ general: d?.message ?? 'Something went wrong' })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-[420px] pr-1
      [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10
      dark:[&::-webkit-scrollbar-thumb]:bg-white/10">
      <div>
        <label className={labelCls}>Room name</label>
        <input
          type="text"
          value={val.name}
          disabled={!isAdmin}
          onChange={e => setVal(v => ({ ...v!, name: e.target.value }))}
          className={numInputCls + ' text-left'}
        />
        {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
      </div>

      {isAdmin && (
        <div className="flex gap-1 p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.04]
          border border-black/[0.06] dark:border-white/[0.06]">
          {Object.keys(PRESETS).map(k => (
            <button key={k}
              onClick={() => { setPreset(k); setVal(v => ({ ...v!, ...PRESETS[k] })) }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                ${preset === k
                  ? 'bg-white dark:bg-white/[0.1] text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'
                }`}
            >{k}</button>
          ))}
          <button
            onClick={() => setPreset('Custom')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
              ${preset === 'Custom'
                ? 'bg-white dark:bg-white/[0.1] text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'
              }`}
          >Custom</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {([
          { label: 'Study (min)',       key: 'studyTimeMs'        },
          { label: 'Short break (min)', key: 'shortBreakTimeMs'   },
          { label: 'Long break (min)',  key: 'longBreakTimeMs'    },
          { label: 'Cycles → long',     key: 'cyclesTillLongBreak'},
        ] as { label: string; key: keyof Settings }[]).map(({ label, key }) => (
          <div key={key}>
            <label className={labelCls}>{label}</label>
            <input
              type="number"
              value={val[key] as number}
              disabled={!isAdmin}
              onChange={e => { setVal(v => ({ ...v!, [key]: parseInt(e.target.value) || 0 })); setPreset('Custom') }}
              onKeyDown={blockInvalid}
              className={numInputCls + (!isAdmin ? ' opacity-50' : '')}
            />
            {errors[key] && <p className="text-xs text-red-500 mt-0.5">{errors[key]}</p>}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {(['private', 'public'] as const).map(opt => (
          <label key={opt} className={`flex items-center gap-2 ${isAdmin ? 'cursor-pointer' : 'opacity-50'}`}>
            <input
              type="checkbox"
              checked={privacy === opt}
              disabled={!isAdmin}
              onChange={() => setVal(v => ({ ...v!, publicRoom: opt === 'public' }))}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-sm capitalize text-gray-600 dark:text-white/55">{opt}</span>
          </label>
        ))}
      </div>

      {errors.general && <p className="text-xs text-red-500 dark:text-red-400">{errors.general}</p>}

      {isAdmin && (
        <button
          onClick={save}
          disabled={saving}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
            bg-indigo-600 text-white hover:bg-indigo-500
            dark:shadow-[0_0_28px_rgba(99,102,241,0.32)]
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : 'Update Room'}
        </button>
      )}
    </div>
  )
}

// ─── Room Page ────────────────────────────────────────────────────────────────

export default function RoomClient() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const router       = useRouter()
  const stompRef     = useRef<Client | null>(null)

  const [roomId,    setRoomId]    = useState<number | null>(null)
  const [roomName,  setRoomName]  = useState('')

  const [messages,  setMessages]  = useState<ChatMsg[]>([])
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([])
  const [pfpMap,    setPfpMap]    = useState<Record<string, string>>({})

  const [profile,   setProfile]   = useState<Profile | null>(null)
  const [settings,  setSettings]  = useState<Settings | null>(null)
  const [timer,     setTimer]     = useState<TimerDto | null>(null)
  const [ms,        setMs]        = useState(0)

  const [loadJoin,      setLoadJoin]      = useState(true)
  const [loadMsgs,      setLoadMsgs]      = useState(true)
  const [loadProfile,   setLoadProfile]   = useState(true)

  const [inputMsg,      setInputMsg]      = useState('')
  const [aiLoading,     setAiLoading]     = useState(false)
  const [showSettings,  setShowSettings]  = useState(false)
  const [showLeave,     setShowLeave]     = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  const [lastRunPhase,  setLastRunPhase]  = useState<TimerPhase | null>(null)
  const messagesContainerRef  = useRef<HTMLDivElement>(null)
  const messagesEndRef        = useRef<HTMLDivElement>(null)
  const audioMapRef           = useRef<Record<string, HTMLAudioElement>>({})
  const prevScrollHeightRef   = useRef(0)
  const loadingMoreRef        = useRef(false)
  const initialScrollDone     = useRef(false)

  const [hasMore,          setHasMore]          = useState(false)
  const [oldestMessageId,  setOldestMessageId]  = useState<number | null>(null)
  const [onlineUserIds,    setOnlineUserIds]    = useState<Set<number>>(new Set())

  // ── Avatar helpers ──────────────────────────────────────────────────────────
  const s3 = (img: string) =>
    `https://costudy-images-bucket.s3.ca-central-1.amazonaws.com/${img}?t=${Date.now()}`
  const defaultAvatar = 'https://api.costudy.online/avatars/default-avatar.png'

  const profileAvatar = profile?.image ? s3(profile.image) : defaultAvatar

  // ── Validate room ───────────────────────────────────────────────────────────
  useEffect(() => {
    apiClient.get(`/room/${roomCode}`, { withCredentials: true })
      .then(res => {
        if (!res.data.success) router.replace(`/home?reason=invalid_room_code&code=${roomCode}`)
        else { setRoomId(res.data.data.roomId); setRoomName(res.data.data.name) }
      })
      .catch(() => router.replace(`/home?reason=invalid_room_code&code=${roomCode}`))
  }, [roomCode, router])

  // ── Fetch profile ───────────────────────────────────────────────────────────
  useEffect(() => {
    apiClient.get('/user')
      .then(res => setProfile(res.data))
      .catch((err: any) => setError(err.message ?? 'Failed to fetch profile'))
      .finally(() => setLoadProfile(false))
  }, [])

  // ── Join room ───────────────────────────────────────────────────────────────
  useEffect(() => {
    apiClient.post(`/room/${roomCode}/join`)
      .catch((err: any) => { if (err.response?.data?.message !== 'Duplicate') setError('Failed to join room') })
      .finally(() => setLoadJoin(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Load users ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loadJoin) return
    apiClient.get(`/room/${roomCode}/users`)
      .then(res => {
        const data: RoomUser[] = res.data.data
        setRoomUsers(data)
        const map: Record<string, string> = {}
        data.forEach(u => { map[u.id] = u.image ? s3(u.image) : defaultAvatar })
        setPfpMap(map)
      })
      .catch(() => setError('Failed to load users'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadJoin, roomCode])

  // ── Load messages ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (roomId == null) return
    apiClient.get(`/rooms/${roomId}/messages`, { params: { limit: 20 }, withCredentials: true })
      .then(res => {
        const data: ChatMsg[] = res.data.data?.messages ?? []
        setMessages(data)
        setHasMore(res.data.data?.hasMore ?? false)
        if (data.length > 0) setOldestMessageId(data[0].chatMessageId)
      })
      .catch(() => setError('Failed to load chat'))
      .finally(() => setLoadMsgs(false))
  }, [roomId])

  // ── Load settings ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (roomId == null) return
    apiClient.get(`/settings/${roomId}`)
      .then(res => setSettings(res.data.data))
      .catch(() => {})
  }, [roomId])

  // ── STOMP WebSocket ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (loadMsgs || roomId == null || loadProfile) return

    const client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws`),
      reconnectDelay: 5000,
    })

    client.onConnect = () => {
      client.subscribe(`/topic/room/${roomId}`, msg => {
        setMessages(prev => [...prev, JSON.parse(msg.body)])
      })
      client.subscribe(`/topic/room/${roomCode}/join`, msg => {
        const u: RoomUser = JSON.parse(msg.body)
        setRoomUsers(prev => [...prev, u])
        setPfpMap(prev => ({ ...prev, [u.id]: u.image ? s3(u.image) : defaultAvatar }))
      })
      client.subscribe(`/topic/room/${roomCode}/kick`, msg => {
        const kicked: string = msg.body
        setRoomUsers(u => u.filter(x => x.username !== kicked))
        if (kicked === profile?.username) { client.deactivate(); router.replace('/home') }
      })
      client.subscribe(`/topic/room/${roomId}/timer`, msg => {
        const dto: TimerDto = JSON.parse(msg.body)
        setTimer(dto); setMs(remaining(dto))
      })
      client.subscribe('/user/queue/timer', msg => {
        const dto: TimerDto = JSON.parse(msg.body)
        setTimer(dto); setMs(remaining(dto))
      })
      client.subscribe('/topic/settings/update', msg => {
        const dto: Settings = JSON.parse(msg.body)
        setRoomName(dto.name); setSettings(dto)
      })
      client.subscribe(`/topic/room/${roomId}/sound`, msg => {
        const key = msg.body.replace(/"/g, '') as keyof typeof audioMapRef.current
        playSound(key)
      })
      client.subscribe(`/topic/room/${roomId}/presence`, msg => {
        setOnlineUserIds(new Set<number>(JSON.parse(msg.body)))
      })
      client.publish({ destination: '/app/timer/status', body: String(roomId) })
      if (profile?.id != null) {
        client.publish({ destination: `/app/room/${roomId}/presence/join`, body: String(profile.id) })
      }
    }

    client.activate()
    stompRef.current = client
    return () => { client.deactivate() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMsgs, roomId, loadProfile])

  // ── Create timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (roomId == null) return
    apiClient.post(`/timer/create/${roomId}`).catch(() => {})
  }, [roomId])

  // ── Local tick ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timer || timer.status !== 'RUNNING') return
    const id = setInterval(() => setMs(remaining(timer)), 1000)
    return () => clearInterval(id)
  }, [timer])

  // ── Scroll to bottom on new messages ────────────────────────────────────────
  useEffect(() => {
    if (messages.length === 0) return
    const el = messagesContainerRef.current
    if (!el) return
    if (!initialScrollDone.current) {
      // First load — jump straight to bottom instantly
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
      initialScrollDone.current = true
      return
    }
    // Subsequent messages (STOMP) — only scroll if already near bottom
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    if (isNearBottom) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Preserve scroll position when prepending history ─────────────────────
  useEffect(() => {
    if (!loadingMoreRef.current) return
    const el = messagesContainerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight - prevScrollHeightRef.current
    loadingMoreRef.current = false
  }, [messages])

  // ── Audio ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    audioMapRef.current = {
      CLICK: new Audio('/audio/button-click.mp3'),
      ALARM: new Audio('/audio/alarm.mp3'),
    }
    Object.values(audioMapRef.current).forEach(a => { a.preload = 'auto'; a.loop = false; a.volume = 0.3 })
  }, [])

  const playSound = (key: keyof typeof audioMapRef.current) => {
    const a = audioMapRef.current[key]
    if (!a) return
    a.pause()
    a.currentTime = 0
    a.play().catch(() => {})
  }

  // ── Last running phase (for background) ────────────────────────────────────
  useEffect(() => {
    if (timer?.status === 'RUNNING') setLastRunPhase(timer.phase)
  }, [timer])

  const timerAccent = 'text-gray-800 dark:text-white/85'

  const isRunning = timer?.status === 'RUNNING'

  const phaseOverlayBg = useMemo(() => {
    const phase = isRunning ? timer!.phase : lastRunPhase
    const gradients: Record<TimerPhase, string> = {
      WORK:        'linear-gradient(-45deg,#4c2539,#91414c,#ae4957,#df7485,#ae4957,#91414c,#4c2539)',
      SHORT_BREAK: 'linear-gradient(-45deg,#22394b,#326983,#3e8fa6,#346d87,#22394b)',
      LONG_BREAK:  'linear-gradient(-45deg,#1b3931,#347d65,#51ae95,#367d65,#1b3931)',
    }
    return phase ? { backgroundImage: gradients[phase], backgroundSize: '400% 400%' } : {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, lastRunPhase])

  // ── Timer display ───────────────────────────────────────────────────────────
  const mm = String(Math.floor(ms / 60000)).padStart(2, '0')
  const ss = String(Math.floor(ms / 1000) % 60).padStart(2, '0')

  useEffect(() => { document.title = `${mm}:${ss} — CoStudy` }, [mm, ss])

  // ── STOMP helpers ───────────────────────────────────────────────────────────
  const publish = (dest: string, body: unknown) => {
    stompRef.current?.publish({
      destination: dest,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
  }

  // ── Chat ────────────────────────────────────────────────────────────────────
  function handleScroll() {
    const el = messagesContainerRef.current
    if (!el || loadingMoreRef.current || !hasMore || oldestMessageId == null) return
    if (el.scrollTop < 80) {
      prevScrollHeightRef.current = el.scrollHeight
      loadingMoreRef.current = true
      apiClient.get(`/rooms/${roomId}/messages`, {
        params: { before: oldestMessageId, limit: 20 },
        withCredentials: true,
      })
        .then(res => {
          const older: ChatMsg[] = res.data.data?.messages ?? []
          setMessages(prev => [...older, ...prev])
          setHasMore(res.data.data?.hasMore ?? false)
          if (older.length > 0) setOldestMessageId(older[0].chatMessageId)
        })
        .catch(() => { loadingMoreRef.current = false })
    }
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!inputMsg.trim() || !stompRef.current?.connected) return
    publish(`/app/room/${roomId}`, {
      roomId, userId: profile?.id, content: inputMsg,
      username: profile?.username, imageIcon: profile?.image, type: 'USER',
    })
    setInputMsg('')
  }

  async function handleSendAi() {
    if (!inputMsg.trim() || aiLoading || !stompRef.current?.connected) return
    const msg = inputMsg
    setAiLoading(true)
    setInputMsg('')

    publish(`/app/room/${roomId}`, {
      roomId, userId: profile?.id, content: msg,
      username: profile?.username, imageIcon: profile?.image, type: 'USER',
    })

    try {
      const res = await axios.post('/api/chat', {
        messages: [
          { role: 'system', content: 'You are an AI tutor for CoStudy, helping students in a virtual study room. Max 100 words.' },
          { role: 'user', content: msg },
        ],
      })
      publish(`/app/room/${roomId}`, {
        roomId, userId: null, content: res.data.content,
        username: null, imageIcon: '', type: 'AI',
      })
    } catch {
      // silently fail
    } finally {
      setAiLoading(false)
    }
  }

  async function kickUser(username: string) {
    try {
      await apiClient.delete(`/room/${roomCode}/kick`, { data: username, headers: { 'Content-Type': 'text/plain' } })
      setRoomUsers(u => u.filter(x => x.username !== username))
    } catch { /* ignore */ }
  }

  function deleteRoom() {
    if (!roomId) return
    apiClient.delete(`/room/${roomId}/delete`)
      .then(() => router.replace('/home'))
      .catch(() => {})
  }

  function leaveRoom() {
    apiClient.delete(`/room/${roomCode}/leave`)
      .then(() => router.replace('/home'))
      .catch(() => {})
  }

  const isAdmin = roomUsers.find(u => u.id === profile?.id)?.admin ?? false
  const cycleLabel = timer?.phase === 'WORK' ? `#${timer.workCyclesDone + 1}` : ''

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#080b14]">
      <p className="text-red-400">{error}</p>
    </div>
  )

  return (
    <PageBackground>
      {/* Phase background overlay */}
      <div
        aria-hidden
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000
          ${isRunning ? 'opacity-[0.32] dark:opacity-[0.82]' : 'opacity-0'}`}
        style={phaseOverlayBg}
      />

      <HomeNavbar profile={profile} avatarSrc={profileAvatar} />

      <main className="relative z-10 px-4 pb-8 max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-5 lg:h-[calc(100vh-140px)]">

          {/* ── Left column: Timer + Users ───────────────────────────────── */}
          <div className="flex flex-col gap-5 w-full lg:w-[400px] shrink-0">

            {/* Timer card */}
            <div className={`${panelCls} p-6 flex flex-col items-center gap-4 relative min-h-[360px]`}>
              {/* Settings toggle */}
              <button
                onClick={() => setShowSettings(s => !s)}
                aria-label="Toggle settings"
                className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200
                  text-gray-400 hover:text-gray-600 hover:bg-black/[0.04]
                  dark:text-white/30 dark:hover:text-white/60 dark:hover:bg-white/[0.06]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>

              <AnimatePresence mode="wait">
                {showSettings ? (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="w-full"
                  >
                    <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4
                      text-indigo-500/55 dark:text-indigo-300/50">Room Settings</p>
                    <SettingsPanel
                      settings={settings}
                      roomId={roomId}
                      isAdmin={isAdmin}
                      onClose={() => setShowSettings(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="timer"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="w-full flex flex-col items-center gap-4"
                  >
                    {/* Room name */}
                    <div className="text-center">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white/85">{roomName}</h2>
                      <p className="text-xs mt-0.5 font-mono tracking-wider text-gray-400 dark:text-white/30">{roomCode}</p>
                    </div>

                    {/* Phase tabs */}
                    <div className="flex gap-1">
                      {([['WORK', `Work ${cycleLabel}`], ['SHORT_BREAK', 'Short Break'], ['LONG_BREAK', 'Long Break']] as [TimerPhase, string][]).map(([phase, label]) => (
                        <button
                          key={phase}
                          onClick={() => publish('/app/timer/skipTo', { roomId, skipToPhase: phase })}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                            ${timer?.phase === phase
                              ? isRunning
                                ? 'bg-black/[0.08] text-gray-800 border border-black/[0.15] dark:bg-white/20 dark:text-white dark:border-white/30'
                                : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300'
                              : isRunning
                                ? 'text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white/80'
                                : 'text-gray-500 dark:text-white/35 hover:text-gray-700 dark:hover:text-white/55'
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Clock */}
                    <span className={`text-8xl font-mono font-bold tabular-nums leading-none ${timerAccent}`}>
                      {mm}:{ss}
                    </span>

                    {/* Start / Pause */}
                    <button
                      onClick={() => {
                        if (!timer)                     publish('/app/timer/start',  { roomId })
                        else if (timer.status === 'PAUSED') publish('/app/timer/resume', roomId)
                        else                            publish('/app/timer/pause',  roomId)
                      }}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300
                        flex items-center justify-center gap-2
                        ${isRunning
                          ? 'bg-black/[0.08] hover:bg-black/[0.13] border border-black/[0.15] text-gray-800 dark:bg-white/20 dark:hover:bg-white/30 dark:border-white/30 dark:text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white dark:shadow-[0_0_28px_rgba(99,102,241,0.32)] dark:hover:shadow-[0_0_42px_rgba(99,102,241,0.5)]'
                        }`}
                    >
                      {isRunning ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                          Pause
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          {!timer ? 'Start' : 'Resume'}
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Users card — flex-1 so it stretches to align with chat bottom */}
            <div className={`${panelCls} p-4 flex flex-col gap-2 lg:flex-1 lg:min-h-0`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase
                  text-gray-500 dark:text-white/38">
                  In Room
                </p>
                {onlineUserIds.size > 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-500 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 inline-block" />
                    {onlineUserIds.size}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 overflow-y-auto lg:flex-1
                max-h-56 lg:max-h-none
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10
                dark:[&::-webkit-scrollbar-thumb]:bg-white/10">
                {roomUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3 px-3 py-2 rounded-xl group
                    hover:bg-black/[0.03] dark:hover:bg-white/[0.03]">
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full overflow-hidden ring-2 transition-all duration-300
                        ${onlineUserIds.has(user.id)
                          ? 'ring-emerald-400 dark:ring-emerald-500'
                          : 'ring-black/5 dark:ring-white/10'}`}>
                        <Image
                          src={pfpMap[user.id] ?? defaultAvatar}
                          alt={user.username}
                          width={32} height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {user.admin && (
                        <span className="absolute -bottom-0.5 -right-0.5 text-[9px]">👑</span>
                      )}
                    </div>
                    <span className={`text-sm flex-1 truncate ${
                      user.id === profile?.id
                        ? 'font-medium text-gray-800 dark:text-white/80'
                        : 'text-gray-600 dark:text-white/55'
                    }`}>{user.username}</span>

                    {/* Kick button (admin only, not self) */}
                    {isAdmin && user.id !== profile?.id && (
                      <button
                        onClick={() => kickUser(user.username)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-red-500 dark:text-red-400
                          hover:underline transition-opacity duration-150"
                      >
                        kick
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Leave button */}
              <button
                onClick={() => setShowLeave(true)}
                className="mt-auto w-full py-2 rounded-xl text-xs font-medium transition-all duration-200
                  text-red-600 dark:text-red-400 border border-red-200 dark:border-red-400/20
                  hover:bg-red-50 dark:hover:bg-red-400/10"
              >
                {isAdmin ? 'Delete Room' : 'Leave Room'}
              </button>
            </div>
          </div>

          {/* ── Chat ─────────────────────────────────────────────────────── */}
          <div className={`${panelCls} flex flex-col flex-1 w-full min-h-0`}
            style={{ minHeight: '500px' }}>
            <div className="p-4 border-b border-black/[0.05] dark:border-white/[0.05]">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase
                text-gray-500 dark:text-white/38">Chat</p>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3
                [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10
                dark:[&::-webkit-scrollbar-thumb]:bg-white/10"
            >
              {hasMore && (
                <p className="text-[11px] text-center text-gray-400 dark:text-white/25 py-1 select-none">
                  Scroll up for older messages
                </p>
              )}
              {messages.map(m => {
                const isMe = m.userId === profile?.id

                if (m.type === 'SERVER') return (
                  <div key={m.chatMessageId} className="flex items-center gap-3 my-1 select-none">
                    <div className="flex-1 h-px bg-black/[0.07] dark:bg-white/[0.07]" />
                    <span className="text-[11px] text-gray-400 dark:text-white/25 whitespace-nowrap">{m.content}</span>
                    <div className="flex-1 h-px bg-black/[0.07] dark:bg-white/[0.07]" />
                  </div>
                )

                if (m.type === 'AI') return (
                  <div key={m.chatMessageId} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500
                      flex items-center justify-center text-white text-xs shrink-0">✦</div>
                    <div className="max-w-[80%]">
                      <p className="text-[10px] text-indigo-500 dark:text-indigo-400 mb-1 font-medium">AI Tutor</p>
                      <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-sm
                        bg-indigo-50 border border-indigo-100 text-gray-800
                        dark:bg-indigo-400/10 dark:border-indigo-400/20 dark:text-white/80">
                        {m.content}
                      </div>
                    </div>
                  </div>
                )

                return (
                  <div key={m.chatMessageId} className={`flex gap-3 items-end ${isMe ? 'flex-row-reverse' : ''}`}>
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mb-0.5">
                        <Image
                          src={pfpMap[m.userId] ?? defaultAvatar}
                          alt={m.username}
                          width={28} height={28}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!isMe && (
                        <p className="text-[10px] text-gray-400 dark:text-white/30 mb-1 ml-0.5">{m.username}</p>
                      )}
                      <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                        ${isMe
                          ? 'rounded-br-sm bg-indigo-600 text-white'
                          : 'rounded-bl-sm bg-black/[0.04] dark:bg-white/[0.07] text-gray-800 dark:text-white/80'
                        }`}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-black/[0.05] dark:border-white/[0.05]">
              <div className="flex gap-2">
                <input
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  placeholder="Message…"
                  className={inputCls}
                />
                {/* AI button */}
                <button
                  type="button"
                  onClick={handleSendAi}
                  disabled={aiLoading}
                  title={aiLoading ? 'Loading AI response…' : 'Ask AI tutor'}
                  className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl
                    transition-all duration-200 disabled:opacity-40
                    bg-black/[0.04] hover:bg-indigo-50 text-gray-500 hover:text-indigo-600
                    dark:bg-white/[0.05] dark:hover:bg-indigo-400/15 dark:text-white/40 dark:hover:text-indigo-300
                    border border-black/[0.06] dark:border-white/[0.06]"
                >
                  <span className="text-base">✦</span>
                </button>
                {/* Send button */}
                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* ── Leave/Delete confirm modal ─────────────────────────────────── */}
      <AnimatePresence>
        {showLeave && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setShowLeave(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-sm mx-4 rounded-2xl p-6 backdrop-blur-xl
                bg-white/90 border border-black/[0.07] shadow-[0_4px_28px_rgba(0,0,0,0.12)]
                dark:bg-[#0d1120]/95 dark:border-white/[0.09]`}
            >
              <p className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                {isAdmin ? 'Delete this room?' : 'Leave this room?'}
              </p>
              {isAdmin && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
                  As admin, this room and all its data will be permanently deleted.
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowLeave(false)}
                  className="flex-1 py-2 rounded-xl text-sm transition-all duration-200
                    bg-black/[0.04] text-gray-600 hover:bg-black/[0.07]
                    dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { isAdmin ? deleteRoom() : leaveRoom(); setShowLeave(false) }}
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
    </PageBackground>
  )
}
