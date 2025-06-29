"use client";

import { useState, ChangeEvent, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
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

  const [profile, setProfile] = useState<any>(user)

  const [src, setSrc] = useState('http://localhost:8080/default-avatar.png')

  useEffect(() => {
    if (user.image != null){setSrc(`http://localhost:8080/avatars/${user.image}`)}   

  }, [])

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
        `http://localhost:8080/${profile.id}/avatar`,
        formData,
        {
          withCredentials: true,
          headers: {'Content-Type': 'multipart/form-data'},
          timeout: 10000
        }
      )

      setSrc(`http://localhost:8080/avatars/${res.data.avatarUrl}`)

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
    <div className="space-y-8">
      
      <div className="flex items-center space-x-6">
        
        <div className="rounded-full border-4 border-[rgb(215,217,238)]">
          <Image
            src={src}
            alt="Profile avatar"
            width={250}
            height={250}
            className="flex-none w-[250px] h-[250px] rounded-full bg-white"
          />
        </div>

        
        <div className="space-y-2">

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
            className="block w-full px-4 py-2 bg-[rgb(84,78,143)] text-white rounded-lg hover:bg-[rgb(70,60,102)]"
          >
            {uploading ? 'Uploading...' : 'Upload Avatar'}
          </button>

          <button
            
            className="block w-full px-4 py-2 border border-gray-800 rounded-lg hover:bg-gray-200"
          >
            Change Default Icon
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>

    </div>
  );
}
