'use client'

import { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import apiClient from "../../lib/apiClient";

interface Room {
    roomId: number,
    name: string,
    code: string,
    admin: boolean,
    members: number
}

export default function UserRooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const router = useRouter();

    useEffect(() => {
        apiClient.get('/rooms')
            .then(res => {
                setRooms(res.data.data)
            })
            .catch(err => console.error(err));
    }, []);



    return (
        <div className='bg-[rgba(255,255,255,0.1)] flex justify-center w-full max-w-[480px] h-[650px] flex-col rounded-lg p-2 gap-2 shadow-2xl'>
            <div className=" w-full flex">
                <div className="flex-1 h-[50] flex justify-between gap-1 items-center">
                    <input type="" className="bg-[rgba(255,255,255,0.1)] h-full text-white p-1 flex-1 rounded-lg" />
                    <button className="bg-[rgba(250,250,250,0.7)] w-[50] h-full flex justify-center flex-col rounded-full text-5xl text-white">
                        
                    </button>


                </div>
            </div>
            <div className="flex-1 w-full overflow-y-auto flex flex-col gap-1 chat-scroll">
                { rooms.map((room) => (
                    <div key={room.roomId} className="w-full">
                        <button 
                            onClick={async () => {
                                await apiClient("/refresh-token");
                                router.push(`/room/${room.code}`);
                            }}
                            className="roomlist-button relative w-full h-[70px] group rounded-lg shadow-xl text-white border-[rgba(255,255,255,0.2)] flex items-center p-2 gap-2 overflow-hidden">
                                <div className={(room.admin ? "bg-[#ffe54f] " : "bg-[#6c44c9] ") + "rounded-lg roomlist-select"}></div>
                                <h1>{room.name}</h1>
                                <h1 className="absolute right-1/3 top-1/2 -translate-y-1/2 text-gray-300">{room.members + "👤"}</h1>
                        </button>
                    </div>
                    
                ))

                }
            </div>
            
        </div>
    );
}
