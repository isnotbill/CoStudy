"use client";

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

export default function PublicProfile() {

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [profile, setProfile] = useState<any>(null)

  const [src, setSrc] = useState('http://localhost:8080/default-avatar.png')


  useEffect(()=> {
      async function fetchProfile(){
          try {
              const res = await axios.get('http://localhost:8080/user',
                    { withCredentials: true, timeout: 5000 }
                  )
                  const data = res.data
              setProfile(data) 
              if (data.image != null){setSrc(`http://localhost:8080/avatars/${data.image}`)}   

          } catch (err: any){
              const msg = err.message
              setError(msg)
          }
      }
      fetchProfile()

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
      const res = await axios.post(
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
        
        <div className="relative w-[250px] h-[250px] rounded-full border-4 border-white overflow-hidden">
          <Image
            src={src}
            alt="Profile avatar"
            fill
            className="object-cover"
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
            className="block w-full px-4 py-2 bg-[rgb(106,91,155)] text-white rounded-lg hover:bg-[rgb(70,60,102)]"
          >
            {uploading ? 'Uploading...' : 'Upload Avatar'}
          </button>

          <button
            
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Change Default Icon
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>

    </div>
  );
}