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

export default function HomePage(){

    const [profile, setProfile] = useState<Profile | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const searchParams = useSearchParams()
    const paramsReason = searchParams.get("reason")
    const paramsCode = searchParams.get("code")

    useEffect(() => {
        async function fetchProfile() {
        try {
            const response = await apiClient.get('/user')
            setProfile(response.data)
        } catch (err: any) {
            setError(err.message || 'Failed to fetch user profile')
            window.location.href = '/login'
        } finally {
            setLoading(false)
        }
        }
        fetchProfile()
    }, [])


    useEffect(() => {
        if (error) {
            //window.location.href = '/login'
        }
    }, [error])

    let src = 'http://localhost:8080/avatars/default-avatar.png'
    console.log(profile?.image)
    if (profile?.image) {
        src = `http://localhost:8080/avatars/${profile.image}`
    }

    return (
        <>

        <main className='bg-[#574a85] w-full min-h-screen flex flex-col items-center gap-4'>
            <MainHeader/>
            <div className='flex flex-col w-full max-w-[1000px] items-center flex-1 gap-4'>
                <div className='flex flex-col gap-2 w-full items-center p-4 rounded-xl'>
                    <Image
                        src={src}
                        alt="Profile avatar"
                        width={150}
                        height={150}
                        className="flex-none w-[120px] h-[120px] rounded-full"
                    />

                    <h1 className="text-white text-3xl text-center">{profile?.username}</h1>
                </div>

                <div className='w-full flex flex-col gap-4 justify-center'> 
                        {paramsReason === "invalid_room_code" && (
                            <h1 className='text-red-500 self-center'>No room code matches "{paramsCode}". Please double-check and try again.</h1>
                        )}
                    <div className='flex flex-wrap gap-4 justify-between'>
                        <JoinCreateRoom username={profile?.username}/>
                        <UserRooms/>
                    </div>

                </div>
            </div>
        </main>
        </>
    );
}
