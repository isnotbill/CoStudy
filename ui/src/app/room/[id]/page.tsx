"use client";

import React from "react";
import { BackgroundGrid } from "@/components/layout/BackgroundGrid";
import { RoomHeader } from "./components/RoomHeader";
import { Timer } from "./components/Timer";
import { ParticipantList } from "./components/UserList";
import { Chat } from "./components/Chat";

import { RoomSchema } from "@/types/RoomInfo";

export default function RoomPage() {
  const data = {
    roomId: 8,
    name: "Test Room",
    code: "TEST1234"
  }

  const parsedRoom = RoomSchema.safeParse(data);
  if (!parsedRoom.success) {
    return <div className="p-4 text-red-500">Error loading room data.</div>;
  }

  return (
    <BackgroundGrid>
      <div className="flex min-h-screen flex-col md:h-screen md:overflow-hidden overflow-y-auto relative">
        <RoomHeader room={parsedRoom.data}/>

        <main className="flex-1 min-h-0 p-4 md:p-6">
          <div className="mx-auto h-full min-h-0 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 md:pb-0">
            
            <section className="flex flex-col min-h-0 gap-6">
              <div className="flex-1 min-h-0">
                <Timer />
              </div>

              <div className="min-h-0 flex-1 hidden lg:block">
                <ParticipantList />
              </div>
            </section>

            <section className="flex flex-col min-h-0">
              <div className="min-h-0 h-[60dvh] lg:h-full">
                <Chat />
              </div>
            </section>

            <div className="lg:hidden max-h-[35dvh] overflow-y-auto">
                <ParticipantList />
            </div>

          </div>
        </main>
      </div>
    </BackgroundGrid>
  );
}
