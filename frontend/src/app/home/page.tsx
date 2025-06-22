'use client'

import Image from 'next/image'
import MainHeader from '@/components/MainHeader'
import axios from 'axios'
import { useEffect, useState } from 'react'
import apiClient from '../../../lib/apiClient' 
import UserRooms from '@/components/UserRooms'
import JoinCreateRoom from '@/components/JoinCreateRoom'

interface Profile {
  username: string
  image?: string | null
}

export default function HomePage(){

    const [profile, setProfile] = useState<Profile | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProfile() {
        try {
            const response = await apiClient.get('/user')
            setProfile(response.data)
        } catch (err: any) {
            setError(err.message || 'Failed to fetch user profile')
        } finally {
            setLoading(false)
        }
        }
        fetchProfile()
    }, [])


    useEffect(() => {
        if (error) {
            window.location.href = '/login'
        }
    }, [error])

    let src = 'http://localhost:8080/avatars/default-avatar.png'
    console.log(profile?.image)
    if (profile?.image) {
        src = `http://localhost:8080/avatars/${profile.image}`
    }

    return (
        <>
        <main className='bg-[rgb(33,31,48)] w-full min-h-screen flex flex-col items-center'>
            <MainHeader/>
            <div className='flex flex-col w-full max-w-[1000px] justify-center items-center'>
                <div className='relative flex items-center justify-start gap-4 rounded-3xl w-full h-[200px]'>

                        <Image
                            src={src}
                            alt="Profile avatar"
                            width={150}
                            height={150}
                            className="ml-[30px] flex-none relative w-[120px] h-[120px] rounded-full bg-white"
                        />

                    <h1 className="text-white text-3xl">{profile?.username}</h1>
                </div>
                <div className='w-full flex flex-wrap gap-4 justify-center'> 
                    
                    <JoinCreateRoom/>
                    <UserRooms/>
                </div>
            </div>
        </main>
        </>
    );
}
