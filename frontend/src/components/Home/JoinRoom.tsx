/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react';
import apiClient from '../../../lib/apiClient';

import { useRouter } from 'next/navigation';



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
            } catch {
                console.error('Error fetching rooms')
            }
        };

        fetchPublicRooms();
    }
    , [submittedSearch, page, searchTerm])
    

    const joinRoom = async (roomCode : string) => {
        try {
            await apiClient.post(`/room/${roomCode}/join`);
            
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
            <input type="text" value={joinInputVal} className="bg-[rgba(255,255,255,0.1)] w-full h-[60px] text-white rounded-md text-center font-bold text-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                    <span className="text-red-400 text-center text-sm">
                        {joinErrorMsg}
                    </span>
            )}
            <div className='relative flex items-center justify-center select-none
                text-xs font-medium text-gray-400 my-1'>
                <span className="flex-1 h-px bg-[#574a85]" />
                <span className='text-center text-gray-300 font-bold text-xl'>OR</span>
                <span className="flex-1 h-px bg-[#574a85]" />
            </div>

            <h1 className='text-white text-center h-[20px] '>
                Browse Public Rooms
            </h1>
            <div className='relative'>
                <input 
                type="text" 
                placeholder="Search public rooms"
                className="w-full  px-4 py-2 pl-10 rounded-md bg-[rgba(255,255,255,0.1)]  text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400" 
                value={searchTerm ?? ""}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                    // trigger search here
                        setSubmittedSearch(searchTerm)
                    }
                }}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-200 text-sm">🔍</span>
            </div>

            <div className='h-[260px] overflow-y-auto chat-scroll mt-4 bg-none rounded-md'>
                {publicRooms
                .filter((room) => room.hostName !== username)
                .map((room) => (
                    <div key={room.id} className="w-full">
                    <div 
                        onClick={async () => {
                        await apiClient.post(`/room/${room.code}/join`)
                        router.push(`/room/${room.code}`);
                        }}
                        className="roomlist-button relative w-full h-[70px] group justify-between text-white border-[rgba(255,255,255,0.2)] flex items-center p-2 gap-2"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                            <span className="font-semibold text-white">{room.roomName}</span>
                            <span className="text-sm text-purple-200">{room.members} member{room.members !== 1 ? "s" : ""}</span>
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
            </div>
        </div>
 )
}

