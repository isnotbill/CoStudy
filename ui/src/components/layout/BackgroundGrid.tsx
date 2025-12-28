"use client";

import React from "react";
import { FloatingSupplies } from "@/components/layout/FloatingSupplies";

export function BackgroundGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[#f8f5e6] text-stone-900 overflow-hidden relative selection:bg-yellow-300"
      style={{
        backgroundImage: `radial-gradient(circle, #e0dcdc 1px, transparent 1px),
          radial-gradient(circle, #e0dcdc 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 10px 10px",
      }}
    >
      <FloatingSupplies />
      {children}
    </div>
  );
}
