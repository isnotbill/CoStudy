"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RoomCard } from "@/components/layout/Card";

const users = [
  { name: "Felix", status: "Focusing", me: true },
  { name: "Sarah", status: "Break", me: false },
  { name: "Mike", status: "Focusing", me: false },
  { name: "Jessica", status: "Away", me: false },
  { name: "David", status: "Focusing", me: false },
  { name: "Ana", status: "Focusing", me: false },
  { name: "Tom", status: "Focusing", me: false },
];

export function ParticipantList() {
  return (
    <RoomCard className="h-full p-4 md:p-5 flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-bold text-slate-800">Roommates</h3>
        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold">{users.length} Online</Badge>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.map((u, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${u.me ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100"}`}>
              <div className="relative">
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                  <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${u.name}`} />
                  <AvatarFallback>{u.name[0]}</AvatarFallback>
                </Avatar>
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${u.status === "Focusing" ? "bg-green-500" : "bg-yellow-400"}`} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{u.name} {u.me && "(You)"}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{u.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoomCard>
  );
}