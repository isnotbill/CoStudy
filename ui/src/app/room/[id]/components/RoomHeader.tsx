"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Settings, LogOut, MoreHorizontal, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { RoomInfo } from "@/types/RoomInfo";

type RoomHeaderProps = {
  room: RoomInfo;
}

export function RoomHeader({ room }: RoomHeaderProps) {
  return (
    <header className="flex justify-between items-center px-4 py-4 md:px-6 bg-white/60 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
      
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-xl text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        
        <div>
          <h1 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
            {room.name}
            <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded-full font-bold uppercase tracking-wider">
              Live
            </span>
          </h1>
          
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 cursor-pointer hover:text-blue-600 transition-colors group">
            <p>Code: {room.code}</p>
            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        
        {/* Settings (Desktop) */}
        <Button variant="outline" size="icon" className="hidden sm:flex border-2 border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 rounded-xl">
          <Settings className="w-5 h-5" />
        </Button>
        
        {/* Leave Button (Desktop) */}
        <Link href="/dashboard">
          <Button variant="destructive" className="hidden sm:flex font-bold bg-red-500 hover:bg-red-600 border-2 border-red-700 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)] active:translate-y-[1px] active:shadow-none transition-all rounded-xl">
            <LogOut className="w-4 h-4 mr-2" /> Leave
          </Button>
        </Link>
        
        {/* Mobile Menu (Dropdown for actions) */}
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-500">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 font-bold">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> Room Settings
              </DropdownMenuItem>
              <Link href="/dashboard">
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" /> Leave Room
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
}