"use client";

import React from "react";
import { RoomCard } from "@/components/dashboard/rooms/RoomCard"; // Assuming this exists from previous step

export function RoomGrid() {
  // Mock Data
  const rooms = [
    { title: "Late Night Physics ⚛️", category: "Science", count: 4, avatars: ["Felix", "Sarah"], isPrivate: false },
    { title: "Lofi Beats & Chill", category: "Music", count: 128, avatars: ["John", "Mike", "Ana"], isPrivate: false },
    { title: "Pomodoro 25/5 Cycles", category: "Productivity", count: 42, avatars: ["A", "B", "C"], isPrivate: false },
    { title: "Calculus Exam Prep", category: "Math", count: 8, avatars: ["D", "E"], isPrivate: true },
    { title: "Silent Reading Hall", category: "Literature", count: 15, avatars: ["F", "G", "H"], isPrivate: false },
    { title: "Python Coding Club 🐍", category: "CS", count: 6, avatars: ["I", "J"], isPrivate: false },
  ];

  return (
    <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
      {rooms.map((room, index) => (
        <RoomCard 
          key={index}
          title={room.title} 
          category={room.category} 
          count={room.count} 
          avatars={room.avatars}
          private={room.isPrivate}
        />
      ))}
    </div>
  );
}