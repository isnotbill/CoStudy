'use client'

import Image from 'next/image'
import MainHeader from '@/components/MainHeader'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function HomePage(){
    const [profile, setProfile] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    useEffect(()=> {
        async function fetchProfile(){
            try {
                const res = await axios.get('http://localhost:8080/user',
                     { withCredentials: true, timeout: 5000 }
                    )
                setProfile(res.data)    
            } catch (err: any){
                const msg = err.message
                setError(msg)
                console.log("hello")
                console.log(msg)
            }
        }
        fetchProfile()

    }, [])

    //if (error){window.location.href='/login'}
    
    return (
        <>
        <main className='bg-[rgb(53,46,78)] w-screen h-screen flex flex-col items-center'>
            <MainHeader/>
            <div className='flex flex-col gap-4 w-full h-full justify-center items-center p-4'>
                <div className='relative flex items-center justify-start gap-4 bg-[rgb(70,60,102)] rounded-3xl w-[1000px] h-[200px]'>
                    <div className="flex-none border-8 border-[rgb(70,60,102)]  bg-white min-w-[200px] w-[200px] min-h-[200px] h-[200px] rounded-full">

                    </div>
                    <h1 className="text-white text-3xl">{profile?.username}</h1>
                </div>
                <div className='w-[1000] h-full flex gap-4'>
                    <div className='bg-[rgb(70,60,102)] w-[500] h-full rounded-3xl'>

                    </div>
                    <div className='bg-[rgb(70,60,102)] w-[500] h-full rounded-3xl'>

                    </div>
                </div>
            </div>
            
            
        </main>
        </>
    );
}
