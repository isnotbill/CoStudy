'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import apiClient from '@/lib/apiClient'
import { PageBackground } from '@/components/PageBackground'
import { HomeNavbar } from '@/components/HomeNavbar'

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: number
  username: string
  email: string
  image: string
}

// ─── Shared input style ───────────────────────────────────────────────────────

const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
  bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400/70
  focus:outline-none focus:ring-2 focus:ring-indigo-400/35 focus:border-indigo-300
  disabled:opacity-50
  dark:bg-white/[0.055] dark:border-white/[0.09] dark:text-white/85
  dark:placeholder:text-white/18 dark:focus:ring-indigo-400/25 dark:focus:border-indigo-400/40`

const labelCls = `block text-[11px] font-semibold tracking-wide uppercase mb-1.5
  text-gray-500 dark:text-white/38`

const panelCls = `rounded-2xl p-8 backdrop-blur-xl
  bg-white/85 border border-black/[0.07] shadow-[0_4px_28px_rgba(0,0,0,0.07)]
  dark:bg-white/[0.05] dark:border-white/[0.09]
  dark:shadow-[0_0_50px_rgba(99,102,241,0.08),_0_0_0_1px_rgba(255,255,255,0.04)]`

// ─── Avatar Section ───────────────────────────────────────────────────────────

function AvatarSection({ profile, onUpdated }: { profile: UserProfile; onUpdated: () => void }) {
  const fileRef    = useRef<HTMLInputElement>(null)
  const [err,     setErr]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [key,     setKey]     = useState(0)   // force re-render after upload

  const src = profile.image
    ? `https://costudy-images-bucket.s3.ca-central-1.amazonaws.com/${profile.image}?t=${Date.now()}&k=${key}`
    : 'https://api.costudy.online/avatars/default-avatar.png'

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setErr(null)
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      await apiClient.post(`/api/${profile.id}/upload`, form, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 10000,
      })
      setKey(k => k + 1)
      onUpdated()
    } catch (err: unknown) {
      const e = err as { message?: string }
      setErr(e.message ?? 'Upload failed')
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Avatar ring */}
      <div className="relative">
        <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-indigo-400/25 dark:ring-indigo-300/20">
          <Image src={src} alt={profile.username} width={112} height={112} className="w-full h-full object-cover" />
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center
            bg-indigo-600 text-white text-sm shadow-md hover:bg-indigo-500 transition-colors
            disabled:opacity-60"
          title="Upload avatar"
        >
          {loading ? '…' : '+'}
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {err && <p className="text-xs text-red-500 dark:text-red-400">{err}</p>}
    </div>
  )
}

// ─── Account Section ──────────────────────────────────────────────────────────

function AccountSection({ profile }: { profile: UserProfile }) {
  const [username,    setUsername]    = useState(profile.username)
  const [origName,    setOrigName]    = useState(profile.username)
  const [editing,     setEditing]     = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)

  const [pw, setPw] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)

  async function saveName() {
    setSaving(true); setNameSuccess(false)
    try {
      await apiClient.put('/user/details', { newUsername: username })
      setOrigName(username); setEditing(false); setNameSuccess(true)
      setTimeout(() => setNameSuccess(false), 2500)
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  async function savePassword() {
    setPwSaving(true); setPwErrors({}); setPwSuccess(false)
    try {
      await apiClient.put('/user/password', pw)
      setPw({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setPwSuccess(true)
      setTimeout(() => setPwSuccess(false), 2500)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setPwErrors(err.response?.data?.data ?? {})
      }
    } finally { setPwSaving(false) }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Username */}
      <div>
        <label className={labelCls}>Username</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={!editing || saving}
            className={inputCls}
          />
          {editing ? (
            <>
              <button onClick={saveName} disabled={saving}
                className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold
                  bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors">
                {saving ? '…' : 'Save'}
              </button>
              <button onClick={() => { setUsername(origName); setEditing(false) }} disabled={saving}
                className="shrink-0 px-4 py-2.5 rounded-xl text-sm transition-colors
                  bg-black/[0.04] text-gray-600 hover:bg-black/[0.07]
                  dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}
              className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                bg-black/[0.04] text-gray-600 hover:bg-black/[0.07]
                dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]">
              Edit
            </button>
          )}
        </div>
        {nameSuccess && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Username updated!</p>}
      </div>

      {/* Email (read-only) */}
      <div>
        <label className={labelCls}>Email</label>
        <input type="email" value={profile.email} disabled className={inputCls} />
      </div>

      {/* Password change */}
      <div>
        <label className={labelCls}>Change Password</label>
        <div className="flex flex-col gap-3">
          {([
            { label: 'Current password', key: 'oldPassword',     type: 'password' },
            { label: 'New password',      key: 'newPassword',     type: 'password' },
            { label: 'Confirm new',       key: 'confirmPassword', type: 'password' },
          ] as { label: string; key: keyof typeof pw; type: string }[]).map(({ label, key, type }) => (
            <div key={key}>
              <input
                type={type}
                placeholder={label}
                value={pw[key]}
                onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                disabled={pwSaving}
                className={inputCls}
              />
              {pwErrors[key] && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{pwErrors[key]}</p>}
            </div>
          ))}
          <button
            onClick={savePassword}
            disabled={pwSaving}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {pwSaving ? 'Saving…' : 'Update Password'}
          </button>
          {pwSuccess && <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center">Password updated!</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter()
  const [profile,       setProfile]       = useState<UserProfile | null>(null)
  const [tab,           setTab]           = useState<'profile' | 'account'>('profile')
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [profileKey,    setProfileKey]    = useState(0)

  useEffect(() => {
    apiClient.get('/user')
      .then(res => setProfile(res.data))
      .catch(() => router.replace('/login'))
  }, [router, profileKey])

  async function handleLogout() {
    setLogoutLoading(true)
    try {
      await apiClient.post('/logout')
      router.replace('/login')
    } catch { /* ignore */ }
    finally { setLogoutLoading(false) }
  }

  const avatarSrc = profile?.image
    ? `https://costudy-images-bucket.s3.ca-central-1.amazonaws.com/${profile.image}?t=${Date.now()}`
    : 'https://api.costudy.online/avatars/default-avatar.png'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3ece0] dark:bg-[#080b14] transition-colors duration-500">
      <PageBackground />
      <HomeNavbar profile={profile} avatarSrc={avatarSrc} />

      <main className="relative z-10 px-4 pb-16 pt-4 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-1
              text-indigo-500/55 dark:text-indigo-300/50">settings</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white/85">Account</h1>
          </div>
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              text-red-600 dark:text-red-400 border border-red-200 dark:border-red-400/20
              hover:bg-red-50 dark:hover:bg-red-400/10 disabled:opacity-50"
          >
            {logoutLoading ? 'Logging out…' : 'Log Out'}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
          className={panelCls}
        >
          {/* Tab bar */}
          <div className="flex gap-1 p-1 mb-7 rounded-xl bg-black/[0.04] dark:bg-white/[0.04]
            border border-black/[0.06] dark:border-white/[0.06]">
            {(['profile', 'account'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                  ${tab === t
                    ? 'bg-white dark:bg-white/[0.1] text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'
                  }`}
              >
                {t === 'profile' ? 'Public Profile' : 'Account Settings'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {profile ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {tab === 'profile'
                  ? <AvatarSection profile={profile} onUpdated={() => setProfileKey(k => k + 1)} />
                  : <AccountSection profile={profile} />
                }
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="text-sm text-center text-gray-400 dark:text-white/30 py-8">Loading…</p>
          )}
        </motion.div>
      </main>
    </div>
  )
}
