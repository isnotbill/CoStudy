"use client";

import { RoomListHeader } from "@/app/dashboard/rooms/components/RoomListHeader";
import { RoomGrid } from "@/app/dashboard/rooms/components/RoomList";

export default function DashboardPage() {
  return (
    <div className="">
      <RoomListHeader />
      <RoomGrid />
    </div>
  );
}