'use client'

import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

export default function Login() {
    const [error, setError] = useState<null | string[]>(null)
    const params = useSearchParams()
    const reason = params.get("reason")

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        setError(null)
        const form = new FormData(e.currentTarget as HTMLFormElement)
        const payload = {
            username: form.get("username"),
            password: form.get("password")
        }
        try {
            const { data } = await axios.post(
                'http://localhost:8080/login',
                payload,
                { 
                    withCredentials: true,
                    timeout: 5000 }
            )
            console.log(data)
            window.location.href='/home'
        } catch (err: unknown) {
            if (axios.isAxiosError(err)){
                if (err.response && err.response.data) {
                    const apiBody = err.response.data as {
                        success?: boolean
                        message?: string
                        data?: string[]
                        error?: string                    
                    }

                    if (Array.isArray(apiBody.data)){
                        setError(apiBody.data)
                    } else {
                        setError([apiBody.message ?? apiBody.error ?? "Unexpected Error"])
                    }
                } else {
                    setError([err.message])
                }
            }


        }
    }

    const handleGoogleLogin = async () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    }

return (
    <>
    <header>
      <title>Login - CoStudy</title>
    </header>
    <main className="bg-gradient-to-br from-[#7464ae] via-[#644fb1] to-[#5c4d94] min-h-screen select-none overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-1 justify-center items-center px-4 pb-1">
        {/* LEFT: Login Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center bg-gray-100 h-[580px] w-[450px] gap-12 px-10 md:px-28 rounded-l-xl md:rounded-l-xl md:rounded-r-none rounded-2xl shadow-lg"
        >
          <h1 className="font-cedarville text-4xl text-[rgba(49,32,77,0.8)] text-center">costudy</h1>
          <div className="flex flex-col w-full gap-2">
            <div className="w-full">
              <label htmlFor="username" className="text-[rgba(49,32,77,0.8)] font-medium">
                Username/Email
              </label>
              <input
                name="username"
                type="text"
                id="username"
                placeholder="Your username"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="password" className="text-[rgba(49,32,77,0.8)] font-medium">
                Password
              </label>
              <input
                name="password"
                type="password"
                id="password"
                placeholder="Enter password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition"
          >
            Log In
          </button>

          {error && <p className="text-red-500 text-sm mt-[-30px]">{error}</p>}
          {reason === "expired_token" && (
            <p className="text-red-500 text-sm mt-[-30px]">Token expired, please log in again.</p>
          )}

          <div className="flex items-center space-x-1 mt-[-35px] text-xs text-gray-500">
            <span>Don&apos;t have an account?</span>
            <Link href="/" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-800 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition flex items-center justify-center space-x-2"
          >
            Log in with Google
          </button>
        </form>

        {/* RIGHT: Hidden on mobile */}
        <div className="hidden md:flex relative bg-[rgb(169,177,194)] w-[450px] h-[580px] rounded-r-xl overflow-visible justify-center shadow-lg">
          <Image
            src="/images/loginchalkboard.png"
            alt="chalkboard"
            width={600}
            height={520}
            className="absolute h-auto max-w-none mt-[115px] object-contain drop-shadow-2xl"
          />
          <Image
            src="/images/loginblob.png"
            alt="main blob"
            width={520}
            height={520}
            className="absolute h-auto max-w-none mt-[235px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </main>
  </>
);
}

