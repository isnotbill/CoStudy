
'use client'
import { useState } from 'react'

export default function AccountSettings() {

  const [username, setUsername] = useState('current_username')
  const [password, setPassword] = useState('')           
  const [email, setEmail]       = useState('user@example.com')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log({ username, password, email })
  }

  return (
    <div className="flex items-center justify-center h-screen ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-8 
                    gap-x-8 gap-y-6"
      >

        <div className="flex justify-start items-center gap-[28px]">
          <label htmlFor="username" className="text-right font-semibold text-gray-800">
            Username:
          </label>
          <input
            id="changeUsername"
            type="text"
            placeholder={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete='off'
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />

        </div>


        <div className="flex justify-start items-center gap-8">
          <label htmlFor="password" className="text-right font-semibold text-gray-800">
            Password:
          </label>
          <input
            id="changePassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete='new-password'
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />
        </div>

                <div className="flex justify-start items-center gap-8">
          <label htmlFor="password" className="text-right font-semibold text-gray-800">
            Old Password:
          </label>
          <input
            id="changePassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete='new-password'
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />
        </div>


        <div className="flex justify-start items-center gap-[60px]">
          <label htmlFor="email" className="text-right font-semibold text-gray-800">
            Email:
          </label>
          <input
            id="email"
            type="email"
            placeholder={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='off'
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />
        </div>

        <div className="col-span-2 mt-4">
          <button
            type="submit"
            className="w-full py-3 bg-[rgb(85,73,255)] text-white rounded-lg hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}