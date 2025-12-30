"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  children: React.ReactNode;
  className?: string;
}

export function RoomCard({ children, className }: RoomCardProps) {
  return (
    <div 
      className={cn(
        // Base Styles: White bg, thick border, hard shadow, rounded corners
        "bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative z-10",
        className
      )}
    >
      {children}
    </div>
  );
}