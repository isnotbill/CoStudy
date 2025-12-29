"use client";

import { RoomListHeader } from "@/components/dashboard/rooms/RoomListHeader";
import { RoomGrid } from "@/components/dashboard/rooms/RoomList";

export default function DashboardPage() {
  return (
    <div className="">
      <RoomListHeader />
      <RoomGrid />
    </div>
  );
}