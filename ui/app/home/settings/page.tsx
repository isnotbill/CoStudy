'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import apiClient from '@/lib/apiClient'

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: number
  username: string
  email: string
  image: string
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
  bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400/70
  focus:outline-none focus:ring-2 focus:ring-indigo-400/35 focus:border-indigo-300
  disabled:opacity-50
  dark:bg-white/[0.055] dark:border-white/[0.09] dark:text-white/85
  dark:placeholder:text-white/18 dark:focus:ring-indigo-400/25 dark:focus:border-indigo-400/40`

const labelCls = `block text-[11px] font-semibold tracking-wide uppercase mb-1.5
  text-gray-500 dark:text-white/38`

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileKey, setProfileKey] = useState(0)

  // avatar
  const [uploadErr, setUploadErr] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imgKey, setImgKey] = useState(0)

  // username
  const [username, setUsername] = useState('')
  const [origName, setOrigName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [savingName, setSavingName] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)

  // password
  const [pw, setPw] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)

  useEffect(() => {
    apiClient.get('/user')
      .then(res => {
        setProfile(res.data)
        setUsername(res.data.username)
        setOrigName(res.data.username)
      })
      .catch(() => router.replace('/login'))
  }, [router, profileKey])

  const avatarSrc = profile?.image
    ? `https://costudy-images-bucket.s3.ca-central-1.amazonaws.com/${profile.image}?t=${Date.now()}&k=${imgKey}`
    : 'https://api.costudy.online/avatars/default-avatar.png'

  // ── Handlers ──

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !profile) return
    setUploadErr(null)
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      await apiClient.post(`/api/${profile.id}/upload`, form, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 10000,
      })
      setImgKey(k => k + 1)
      setProfileKey(k => k + 1)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setUploadErr(e.message ?? 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function saveName() {
    setSavingName(true); setNameSuccess(false)
    try {
      await apiClient.put('/user/details', { newUsername: username })
      setOrigName(username); setEditingName(false); setNameSuccess(true)
      setTimeout(() => setNameSuccess(false), 2500)
    } catch { /* ignore */ }
    finally { setSavingName(false) }
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

  // ── Render ──

  if (!profile) {
    return (
      <>
        <h1 className="text-2xl font-bold text-heading mb-4">Account Settings</h1>
        <p className="text-sm text-body py-20 text-center">Loading…</p>
      </>
    )
  }

  return (
    <div className="max-w-2xl pt-4">
      <h1 className="text-2xl font-bold text-heading mb-6">Account Settings</h1>

      {/* ── Profile row ── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-[3px] ring-indigo-400/25 dark:ring-indigo-300/20">
            <Image src={avatarSrc} alt={profile.username} width={64} height={64}
              className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center
              bg-indigo-600 text-white text-[11px] shadow-md hover:bg-indigo-500 transition-colors
              disabled:opacity-60"
            title="Upload avatar"
          >
            {uploading ? '…' : '+'}
          </button>
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-heading truncate">{profile.username}</p>
          <p className="text-sm text-body truncate">{profile.email}</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {uploadErr && <p className="text-xs text-red-500 dark:text-red-400 mb-4">{uploadErr}</p>}

      {/* ── Fields grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 mb-6">
        {/* Username */}
        <div>
          <label className={labelCls}>Username</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={!editingName || savingName}
              className={inputCls}
            />
            {editingName ? (
              <>
                <button onClick={saveName} disabled={savingName}
                  className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold
                    bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors">
                  {savingName ? '…' : 'Save'}
                </button>
                <button onClick={() => { setUsername(origName); setEditingName(false) }} disabled={savingName}
                  className="shrink-0 px-4 py-2.5 rounded-xl text-sm transition-colors
                    bg-black/[0.04] text-gray-600 hover:bg-black/[0.07]
                    dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditingName(true)}
                className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                  bg-black/[0.04] text-gray-600 hover:bg-black/[0.07]
                  dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]">
                Edit
              </button>
            )}
          </div>
          {nameSuccess && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Username updated!</p>}
        </div>

        {/* Email */}
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" value={profile.email} disabled className={inputCls} />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-black/[0.06] dark:border-white/[0.06] mb-6" />

      {/* ── Password section ── */}
      <h2 className="text-sm font-semibold text-heading mb-4">Change Password</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
      </div>
      <button
        onClick={savePassword}
        disabled={pwSaving}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
          bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {pwSaving ? 'Saving…' : 'Update Password'}
      </button>
      {pwSuccess && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Password updated!</p>}
    </div>
  )
}
