"use client";

import React from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RoomListHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-centers md:items-center gap-4 mb-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
        Your Rooms
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Join a live session or start your own.
        </p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
          <Input 
            placeholder="Search rooms" 
            className="pl-9 bg-white border-2 border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 rounded-xl transition-all"
          />
        </div>

        <Button variant="outline" size="icon" className="border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 rounded-xl">
          <Filter className="w-4 h-4" />
        </Button>

        <Button className="font-bold bg-slate-900 text-white hover:bg-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none transition-all border-2 border-slate-900 rounded-xl">
          <Plus className="mr-2 w-4 h-4" /> New Room
        </Button>
      </div>
    </div>
  );
}