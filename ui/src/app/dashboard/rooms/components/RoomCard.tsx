"use client";

import React from "react";
import { Play, Lock, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link"

interface RoomCardProps {
  name: string;
  code: string;
  members: number;
  avatars: string[];
  private?: boolean;
  isAdmin?: boolean;
}

export function RoomCard({ name, code, members, avatars, private: isPrivate, isAdmin }: RoomCardProps) {
  return (
    <div 
      className={cn(
        "group relative bg-white border-2 rounded-xl p-5 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full justify-between",
        isAdmin ? "border-blue-200 hover:border-blue-600" : "border-slate-200 hover:border-blue-600"
      )}
    >
      
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200 font-bold gap-1 px-1.5">
                <Crown className="w-3 h-3 fill-yellow-700" />
                <span className="text-[10px] uppercase tracking-wide">Owner</span>
              </Badge>
            )}

            <Badge variant="secondary" className="bg-slate-100 text-slate-600font-bold border-slate-200">
              {code}
            </Badge>
          </div>

          {isPrivate ? (
            <Lock className="w-4 h-4 text-slate-400" />
          ) : (
            <div className="flex items-center text-[10px] font-black tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Live
            </div>
          )}
        </div>
        
        <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center -space-x-3">
          {avatars.map((seed, i) => (
            <Avatar key={i} className="w-8 h-8 border-2 border-white bg-slate-100">
              <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`} />
              <AvatarFallback>{seed[0]}</AvatarFallback>
            </Avatar>
          ))}
          {members > avatars.length && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 z-10">
              +{members - avatars.length}
            </div>
          )}
        </div>
        <Link href={`/room/${code}`}>
          <Button 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
          >
            Join <Play className="ml-1 w-3 h-3 fill-white" />
          </Button>
        </Link>

      </div>
    </div>
  );
}
