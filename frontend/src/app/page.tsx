'use client'

import axios from 'axios'
import Image from "next/image"
import Header from "@/components/Header"
import { useState } from 'react';
import AboutPage from '@/components/About';
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import ReCaptcha from 'react-google-recaptcha';

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Home() {
  const [error, setError] = useState<string[] | null>(null);

  const [captchaToken, setCaptchaToken] = useState("")

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setError(null)

    const form = new FormData(e.currentTarget as HTMLFormElement)
    const confirmPassword = form.get("confirm")
    const payload = {
      email: form.get("email"),
      username: form.get("username"),
      password: form.get("password"),
      captchaToken: captchaToken
    }

    if (payload.password != confirmPassword) {
      setError(["Passwords don't match!"])
      return
    }

    try {
      await axios.post(
        'https://api.costudy.online/register',
        payload,
        { timeout: 5000 }
      )
      window.location.href='/login'
    } catch (error) {

      if (axios.isAxiosError(error)){
        if (error.response && error.response.data){
          const apiBody= error.response.data as {
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
          setError([error.message])
          console.log(error.message)
          
        }
      }
      


    }
  }

  return (
    <>
      <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#7464ae] via-[#644fb1] to-[#5c4d94]">
        <Header/>

        <section className="flex-1 flex items-center justify-center w-full py-10">
          <motion.section
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className='justify-center page-wrapper flex flex-col lg:flex-row items-center gap-8'>
              <div className="flex flex-col items-start justify-center w-full max-w-xl px-4 sm:px-6 md:px-0 text-left">
                <h1 className="text-white font-cedarville text-4xl sm:text-4xl lg:text-4xl font-normal">
                Study Together, Stress-Free
                </h1>

                <h2 className="text-gray-300 font-kumbh my-4 sm:my-5 text-base sm:text-lg font-normal">
                Join virtual study groups, stay motivated, and collaborate with friends.
                </h2>

                <Image 
                src="/images/heroimage.svg"
                alt="Study together illustration"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full max-w-md sm:max-w-lg h-auto"
                />
                </div>

              <form 
              onSubmit={handleSubmit}
              className="bg-gray-100 w-full max-w-[380px] min-w-[200px] h-[550px] px-4 gap-2 rounded-2xl flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold text-[rgba(49,32,77,0.8)] text-center">Create Your Account</h2>

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-col">
                    <label htmlFor="confirm-password" className="text-[rgba(49,32,77,0.8)] font-medium">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      id="confirm-password"
                      placeholder="Your email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      minLength={8}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="username" className="text-[rgba(49,32,77,0.8)] font-medium">
                      Username
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

                  <div className="flex flex-col">
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
                      minLength={8}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="confirm-password" className="text-[rgba(49,32,77,0.8)] font-medium">
                      Confirm Password
                    </label>
                    <input
                      name="confirm"
                      type="password"
                      id="confirm-password"
                      placeholder="Confirm password"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      minLength={8}
                    />
                  </div>

                    {error && <span className="text-red-500 text-sm flex flex-col gap-2">{
                      error.map((msg, i) => (<p key={i}>{msg}</p>))
                      }</span>}
                </div>
                <ReCaptcha
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(token : string | null) => {
                    if (token) {
                      setCaptchaToken(token);
                    } else {
                      setCaptchaToken("");
                    }
                  }}
                  className="flex justify-center items-center w-full">

                </ReCaptcha>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition"
                >
                  Sign Up
                </button>
              </form>
            </div>
              
          </motion.section>

        </section>
      </main>
      <section id="about">
        <AboutPage />
      </section>

    </>

  );
}
