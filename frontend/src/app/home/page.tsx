'use client'

import Image from 'next/image'
import MainHeader from '@/components/MainHeader'
import { useEffect, useState } from 'react'
import apiClient from '../../../lib/apiClient'
import UserRooms from '@/components/UserRooms'
import JoinCreateRoom from '@/components/JoinCreateRoom'
import { useSearchParams } from 'next/navigation'

interface Profile {
  username: string
  image?: string | null
}

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)


  const searchParams = useSearchParams()
  const paramsReason = searchParams.get("reason")
  const paramsCode = searchParams.get("code")

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await apiClient.get('/user')
        setProfile(response.data)
      } catch {

        window.location.href = '/login'
      } 
    }
    fetchProfile()
  }, [])

  let src = 'http://localhost:8080/avatars/default-avatar.png'
  if (profile?.image) {
    src = `http://localhost:8080/avatars/${profile.image}`
  }

  return (
    <main className="bg-gradient-to-br from-[#7464ae] via-[#644fb1] to-[#5c4d94] text-white min-h-screen w-full">
      <MainHeader />

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center gap-6">
        {/* Profile Card */}
        <div className="w-full flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
          <Image
            src={src}
            alt="Profile avatar"
            width={120}
            height={120}
            className="rounded-full border-4 border-white shadow-md"
          />
          <h1 className="text-3xl font-bold">{profile?.username}</h1>
        </div>

        {/* Error Message */}
        {paramsReason === "invalid_room_code" && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-6 py-2 text-sm rounded-lg text-center">
            No room code matches &quot;<span className="font-semibold">{paramsCode}</span>&quot;. Please double-check and try again.
          </div>
        )}

        {/* Room Actions */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-md border border-white/20">
            <JoinCreateRoom username={profile?.username} />
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-md border border-white/20">
            <UserRooms />
          </div>
        </div>
      </div>
    </main>
  )
}
