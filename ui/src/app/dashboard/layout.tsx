"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashLayout";
import { RoomListHeader } from "@/components/dashboard/rooms/RoomListHeader";
import { RoomGrid } from "@/components/dashboard/rooms/RoomList";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="gap-8w-full">

        {children}

      </div>
    </DashboardLayout>
  );
}