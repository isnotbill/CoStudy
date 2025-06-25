'use client'

import { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import apiClient from "../../lib/apiClient";
import Popup from "./Popup";

interface Room {
    roomId: number,
    name: string,
    code: string,
    admin: boolean,
    members: number
}

export default function UserRooms() {
    const [popupRoom, setPopupRoom] = useState<Room | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        apiClient.get('/rooms')
            .then(res => {
                setRooms(res.data.data)
            })
            .catch(err => console.error(err));
    }, []);

    const deleteRoom = (roomId : number) => {
        apiClient.delete(`/room/${roomId}/delete`)
            .then(res => {
                setRooms(prevRooms => prevRooms.filter(room => room.roomId != roomId));
            })
            .catch(err => console.error(err));
    }
    
    const leaveRoom = (roomCode : string) => {
        apiClient.delete(`/room/${roomCode}/leave`)
            .then(res => {
                setRooms(prevRooms => prevRooms.filter(room => room.code != roomCode));
            })
            .catch(err => console.error(err));
    }

    const filteredRooms = rooms.filter((room) => 
        room.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='bg-[rgba(255,255,255,0.1)] flex justify-center w-full max-w-[480px] h-[650px] flex-col rounded-md p-2 gap-2 shadow-2xl'>
            <div className=" w-full flex">
                <div className="flex-1 h-[50] flex justify-between gap-1 items-center">
                    <input 
                        type="text" 
                        placeholder="Search for room"
                        className="bg-[rgba(255,255,255,0.1)] h-full text-white p-1 flex-1 rounded-lg" 
                        value={search ?? ""}
                        onChange={(e) => setSearch(e.target.value)}
                        />


                </div>
            </div>
            <div className="w-full overflow-y-auto flex flex-col gap-1 chat-scroll">
                { filteredRooms.map((room) => (
                    <div key={room.roomId} className="w-full">
                        <div 
                            onClick={async () => {
                                await apiClient.get("/refresh-token");
                                router.push(`/room/${room.code}`);
                            }}
                            className="roomlist-button relative w-full h-[70px] group rounded-lg shadow-xl justify-between text-white border-[rgba(255,255,255,0.2)] flex items-center p-2 gap-2">
                            <div className="h-full flex items-center gap-2">
                                <div className={(room.admin ? "bg-[#ffe54f] " : "bg-[#6c44c9] ") + "rounded-lg roomlist-select"}></div>
                                <h1 className="text-l">{room.name}</h1>
                            </div>
                            
                            <h1 className="absolute right-1/3 top-1/2 -translate-y-1/2 text-gray-300">{room.members + "👤"}</h1>
                            <button className="roomlist-select-delete bg-[#fd4a4a] rounded-full flex items-center justify-center"
                            onClick={async (e) => {
                                e.stopPropagation();
                                setPopupRoom(room);
                                //room.admin ? deleteRoom(room.roomId) : leaveRoom(room.code)
                            }}>
                                
                                <Image
                                src={(room.admin ? "/images/leaveRoom.png" : "/images/leaveRoom.png")}
                                alt={(room.admin ? "Delete" : "Leave")}
                                height={50}
                                width={50}
                                />
                            </button>
                
                        </div>
                        
                    </div>
                    
                ))

                }
            </div>
            <Popup isOpen={!!popupRoom} onClose={() => setPopupRoom(null)}>
                <h1 className="text-white">Are you sure you want to {popupRoom?.admin ? "delete" : "leave"} this room?</h1>
                <button className="popup-button w-full h-[45px] mt-5"
                onClick={(e) => {
                    if(!popupRoom) return;
                    popupRoom.admin ? deleteRoom(popupRoom?.roomId) : leaveRoom(popupRoom.code);
                    setPopupRoom(null);
                }}>
                
                    Confirm
                </button>
            </Popup>
            
        </div>
    );
}
