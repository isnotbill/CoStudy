'use client'

import Image from 'next/image'
import MainHeader from '@/components/MainHeader'
import axios from 'axios'
import { useEffect, useState } from 'react'
import apiClient from '../../../lib/apiClient' 

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

    let src = 'http://localhost:8080/default-avatar.png'
    if (profile?.image) {
        src = `http://localhost:8080/avatars/${profile.image}`
    }

    return (
        <>
        <main className='bg-[rgb(33,31,48)] w-screen h-screen flex flex-col items-center'>
            <MainHeader/>
            <div className='flex flex-col gap-4 w-full h-full justify-center items-center p-4'>
                <div className='relative flex items-center justify-start gap-4 rounded-3xl w-[1000px] h-[200px]'>

                        <Image
                            src={src}
                            alt="Profile avatar"
                            width={150}
                            height={150}
                            className="ml-[30px] flex-none relative w-[120px] h-[120px] rounded-full"
                        />

                    <h1 className="text-white text-3xl">{profile?.username}</h1>
                </div>
                <div className='w-[1000] h-full flex gap-4'>
                    <div className='bg-[#333044] w-[500] h-full rounded-3xl'>

                    </div>
                    <div className='bg-[#333044] w-[500] h-full rounded-3xl'>

                    </div>
                </div>
            </div>
            
            
        </main>
        </>
    );
}
