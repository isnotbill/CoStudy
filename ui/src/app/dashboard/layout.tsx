"use client";

import React from "react";
import { DashboardLayout } from "@/app/dashboard/components/DashLayout";
import { RoomListHeader } from "@/app/dashboard/rooms/components/RoomListHeader";
import { RoomGrid } from "@/app/dashboard/rooms/components/RoomList";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="gap-8w-full">

        {children}

      </div>
    </DashboardLayout>
  );
}