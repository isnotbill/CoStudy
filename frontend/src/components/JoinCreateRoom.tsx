'use client'
import { use, useEffect, useState } from 'react';
import apiClient from '../../lib/apiClient';
import { join } from 'path';
import { useRouter } from 'next/navigation';

export default function JoinCreateRoom() {
    const [activeTab, setActiveTab] = useState<'create' | 'join'>('join')

    const [inputVal, setInputVal] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const joinRoom = async (roomCode : string) => {
        try {
            const res = await apiClient.post(`/room/${roomCode}/join`);
            
            router.push(`/room/${roomCode}`);

        } catch (err : any) {
            if(err.response && err.response.status === 409) {
                setErrorMsg(err.response.data.message);
            } else {
                setErrorMsg(err.response.data.message);
            }
        }
    }

    return (
        <div className='bg-[rgba(255,255,255,0.1)] flex items-center w-full max-w-[480px] h-[650px] flex-col rounded-lg overflow-hidden px-2 gap-4'>
            <div className='relative w-full'>
                <div className='relative flex gap-2 h-full w-full p-1'>
                    <button onClick={() => setActiveTab('join')}
                    className={`w-1/2 h-[60px] rounded-lg text-white z-20 relative home-buttons
                    ${activeTab === 'join' ? 'bg-[rgba(250,250,250,0.1)] home-button-active' : 'bg-none'}`}>
                        Join Room
                    </button>   

                    <button onClick={() => setActiveTab('create')}
                    className={`w-1/2 h-[60px] rounded-lg text-white z-20 relative home-buttons
                    ${activeTab === 'create' ? 'bg-[rgba(250,250,250,0.1)] home-button-active' : 'bg-none'}`}>
                        Create Room
                    </button>
                </div>

            </div>
            <div className='h-full w-full'>
                {activeTab === 'join' && 
                <div className='h-full w-full flex flex-col'>
                    <div className='w-full h-[60px]'>
                        <div className='text-center text-white'>Enter Room Code</div>
                        <input type="text" value={inputVal} className="bg-[rgba(255,255,255,0.1)] w-full h-full text-white p-1 flex-1 rounded-lg text-center font-bold text-xl"
                        onChange={(e) => {
                            setInputVal(e.target.value)
                            setErrorMsg('')
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                joinRoom(inputVal); // optionally handle Enter key
                            }}
                        }
                         />
                         
                    </div>
                    {errorMsg && (
                            <div className="text-red-400 mt-8 text-center">
                                {errorMsg}
                            </div>
                    )}
                    
                        
                </div>
                }

            </div>
            
        </div>
    );
}
