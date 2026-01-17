"use client";

import React, { useEffect } from "react";
import { RoomCard } from "./RoomCard"; // Assuming this exists from previous step

import apiClient from "@/lib/apiClient";

interface Room {
  roomId: number
  name: string
  code: string
  admin: boolean
  members: number
  private: boolean // TODO: Add to backend
  avatars: string[] // TODO: Add to backend
}

export function RoomGrid() {
  const [rooms, setRooms] = React.useState<Room[]>([]);

  useEffect(() => {
    apiClient
      .get('/rooms')
      .then(res => setRooms(res.data.data))
      .catch((err: unknown) => console.error(err))
  }, [])

  return (
    <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
      {rooms.map((room, index) => (
        <RoomCard 
          key={index}
          name={room.name} 
          code={room.code} 
          members={room.members} 
          avatars={["Felix", "Sarah"]}
          private={true}
          isAdmin={room.admin}
        />
      ))}
    </div>
  );
}
