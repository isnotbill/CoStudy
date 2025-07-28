/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, useRef, useEffect } from "react";
import Image from "next/image";
import apiClient from "../../lib/apiClient";

interface Profile {
  user: {
    id: number,
    image: string
  }
}

export default function PublicProfile( { user } : Profile ) {

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const profile = user

  const [src, setSrc] = useState('https://api.costudy.online/avatars/default-avatar.png')

  useEffect(() => {
    if (user.image != null){setSrc(`https://costudy-images-bucket.s3.ca-central-1.amazonaws.com/${user.image}?t=${Date.now()}`)}   

  }, [user.image])

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0]
    if (!file) {
      setError('Please select a file first.')
      return
    }

    setError(null)
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await apiClient.post(
        `/api/${profile.id}/upload`,
        formData,
        {
          withCredentials: true,
          headers: {'Content-Type': 'multipart/form-data'},
          timeout: 10000
        }
      )

      setSrc(`https://costudy-images-bucket.s3.ca-central-1.amazonaws.com/${res.data.avatarUrl}?t=${Date.now()}`)

    } catch (err: any) {

      setError(
        err.message ||
        'Upload failed'
      )


    } finally {
      setUploading(false)
      e.target.value=''
    }

  }


  
  return (
    <div className="space-y-8 px-4 sm:px-6 md:px-0 max-w-md mx-auto">
      <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-6 md:space-y-0">
        
        {/* Avatar */}
        <div className="rounded-full border-4 border-[rgb(215,217,238)] flex-shrink-0">
          <Image
            src={src}
            alt="Profile avatar"
            width={250}
            height={250}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-[250px] md:h-[250px] rounded-full bg-white object-cover"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          
          <input 
            type='file'
            accept='image/*'
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          
          <button
            type='button'
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full px-4 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              uploading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Avatar'}
          </button>

          <button
            type="button"
            className="w-full px-4 py-3 border border-gray-800 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Change Default Icon
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
