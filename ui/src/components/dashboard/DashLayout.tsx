"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { BackgroundGrid } from "@/components/layout/BackgroundGrid";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BackgroundGrid showFloatingSupplies={false}>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto h-screen">
            {children}
        </main>
      </div>
    </BackgroundGrid>
  );
}