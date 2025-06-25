'use client'
import { use, useEffect, useState } from 'react';
import apiClient from '../../../lib/apiClient';
import { join } from 'path';
import { useRouter } from 'next/navigation';

import Image from 'next/image'

interface PublicRoom {
    id: number,
    code: string,
    roomName: string,
    hostName: string,
    members: number
}

export default function JoinRoom({ username } : { username: string}) {
    const [joinInputVal, setJoinInputVal] = useState('');

    const [joinErrorMsg, setJoinErrorMsg] = useState('');
    const router = useRouter();

    const page = 0;
    const size = 8;
    const [searchTerm, setSearchTerm] = useState('');
    const [submittedSearch, setSubmittedSearch] = useState('');
    const [publicRooms, setPublicRooms] = useState<PublicRoom[]>([])

    useEffect(() => {
        const fetchPublicRooms = async () => {
            try {
                const res = await apiClient.get(`/room/public?page=${page}&size=${size}&keyword=${searchTerm}`);
                const rooms = res.data._embedded?.publicRoomDtoList || [];
                setPublicRooms(rooms)
            } catch (err : any) {
                console.error('Error fetching rooms')
            }
        };

        fetchPublicRooms();
    }
    , [submittedSearch, page])
    

    const joinRoom = async (roomCode : string) => {
        try {
            const res = await apiClient.post(`/room/${roomCode}/join`);
            
            router.push(`/room/${roomCode}`);

        } catch (err : any) {
            if(err.response && err.response.status === 409) {
                setJoinErrorMsg(err.response.data.message);
            } else {
                setJoinErrorMsg(err.response.data.message);
            }
        }
    }
    
    return (
        <div className='h-full w-full flex flex-col gap-1'>
            <h1 className='text-center h-[20px] text-white'>Enter Room Code</h1>
            <input type="text" value={joinInputVal} className="bg-[rgba(255,255,255,0.1)] w-full h-[60px] text-white rounded-md text-center font-bold text-xl"
            placeholder='XXXXXX'
            onChange={(e) => {
                setJoinInputVal(e.target.value)
                setJoinErrorMsg('')
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    joinRoom(joinInputVal); // optionally handle Enter key
                }}
            }
                />

            {joinErrorMsg && (
                    <div className="text-red-400 text-center">
                        {joinErrorMsg}
                    </div>
            )}
            <h1 className='text-white text-center h-[20px]'>
                Public Rooms
            </h1>
            <input 
            type="text" 
            placeholder="Search for room"
            className="bg-[rgba(255,255,255,0.1)] h-[60px] text-white p-1 rounded-lg" 
            value={searchTerm ?? ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                // trigger search here
                    setSubmittedSearch(searchTerm)
                }
            }}
            />
            <div className='flex flex-col h-[390] overflow-y-auto chat-scroll bg-[rgba(0,0,0,0.08)] rounded-md'>
                {publicRooms
                .filter((room) => room.hostName !== username)
                .map(((room) => (
                    <div key={room.id} className="w-full">
                        <div 
                            onClick={async () => {
                                await apiClient.get("/refresh-token");
                                await apiClient.post(`/room/${room.code}/join`)
                                router.push(`/room/${room.code}`);
                            }}
                            className="roomlist-button relative w-full h-[70px] group justify-between text-white border-[rgba(255,255,255,0.2)] flex items-center p-2 gap-2">
                            <div className="h-full flex items-center gap-2">
                                <h1 className="text-l">{room.roomName}</h1>
                            </div>
                            
                            <h1 className="absolute right-1/3 top-1/2 -translate-y-1/2 text-gray-300">{room.members + "👤"}</h1>
                            <button className="roomlist-select-delete bg-[#fd4a4a] rounded-full flex items-center justify-center"
                            onClick={async (e) => {
                                e.stopPropagation();
                            }}>
                                <Image
                                src={"/images/leaveRoom.png"}
                                alt={"Leave"}
                                height={50}
                                width={50}
                                />
                            </button>
                        </div>
                    </div>
                )))
                }
            </div>
        </div>
 )
}

