"use client";

import React from "react";
import { Book } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link"

export function Navbar() {
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-5xl mx-auto">
      <div
        className="flex items-center gap-3 font-black text-3xl tracking-tighter text-blue-600 transform -rotate-2"
        style={{ fontFamily: "var(--font-cedarville)" }}
      >
        <Book size={28} strokeWidth={3} />
        costudy.
      </div>

      <div className="flex items-center gap-4">
        <Badge 
          variant="outline" 
          className="hidden sm:flex px-4 py-1 h-auto bg-white border-2 border-stone-800 text-stone-800 rounded-full text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-2 hover:bg-white"
        >
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2 border border-black animate-bounce"></span>
          1,240 online
        </Badge>

        <Button 
          className="font-bold text-stone-700 text-base bg-transparent hover:bg-transparent hover:underline decoration-2 underline-offset-4 transition-all"
        >
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </nav>
  );
}