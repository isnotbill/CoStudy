'use client'

import { useEffect, useState } from "react"
import Image from 'next/image'
import { useRouter } from "next/navigation"
import apiClient from "../../lib/apiClient"
import Popup from "./Popup"

interface Room {
  roomId: number
  name: string
  code: string
  admin: boolean
  members: number
}

export default function UserRooms() {
  const [popupRoom, setPopupRoom] = useState<Room | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [search, setSearch] = useState("")
  const router = useRouter()

  useEffect(() => {
    apiClient
      .get('/rooms')
      .then(res => setRooms(res.data.data))
      .catch(err => console.error(err))
  }, [])

  const deleteRoom = (roomId: number) => {
    apiClient.delete(`/room/${roomId}/delete`)
      .then(() => setRooms(prev => prev.filter(r => r.roomId !== roomId)))
      .catch(err => console.error(err))
  }

  const leaveRoom = (roomCode: string) => {
    apiClient.delete(`/room/${roomCode}/leave`)
      .then(() => setRooms(prev => prev.filter(r => r.code !== roomCode)))
      .catch(err => console.error(err))
  }

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 border border-white/20"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-200 text-sm">🔍</span>
      </div>

      {/* Room List */}
      <div className="flex flex-col gap-1 h-[500] overflow-y-auto chat-scroll">
        {filteredRooms.map(room => (
          <div
            key={room.roomId}
            onClick={async () => {
              await apiClient.get("/refresh-token")
              router.push(`/room/${room.code}`)
            }}
            className="group cursor-pointer flex items-center justify-between bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg border border-white/20 transition hover:bg-white/20"
          >
            {/* Room Info */}
            <div className="flex items-center gap-3">
              <div className={`w-3 h-12 rounded ${room.admin ? "bg-yellow-400" : "bg-purple-500"}`}></div>
              <div className="flex flex-col">
                <span className="font-semibold text-white">{room.name}</span>
                <span className="text-sm text-purple-200">{room.members} member{room.members !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Leave/Delete */}
            <button
              className="p-1.5 rounded-full hover:bg-red-600 bg-red-500 transition"
              onClick={(e) => {
                e.stopPropagation()
                setPopupRoom(room)
              }}
              title={room.admin ? "Delete room" : "Leave room"}
            >
              <Image
                src="/images/leaveRoom.png"
                alt="Leave"
                width={22}
                height={22}
              />
            </button>
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <div className="text-purple-300 text-sm text-center mt-4">No rooms found.</div>
        )}
      </div>

      {/* Confirmation */}
      <Popup show={!!popupRoom} onClose={() => setPopupRoom(null)}>
        <h1 className="text-white text-center text-lg">
          Are you sure you want to {popupRoom?.admin ? "delete" : "leave"} this room?
        </h1>
        <button
          className="popup-button w-full h-[45px] mt-6"
          onClick={() => {
            if (!popupRoom) return

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            popupRoom.admin ? deleteRoom(popupRoom.roomId) : leaveRoom(popupRoom.code)
            setPopupRoom(null)
          }}
        >
          Confirm
        </button>
      </Popup>
    </div>
  )
}

