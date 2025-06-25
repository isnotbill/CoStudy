'use client'
import { useEffect, useState } from 'react';


import CreateRoom from './Home/CreateRoom';
import JoinRoom from './Home/JoinRoom';

interface JoinCreateRoomProps {
  username?: string;
}


export default function JoinCreateRoom({ username }: JoinCreateRoomProps) {

    const [activeTab, setActiveTab] = useState<'create' | 'join'>('create')

    return (
        <div className='bg-[rgba(255,255,255,0.1)] flex items-center w-full max-w-[480px] h-[650px] flex-col rounded-md overflow-hidden px-2 pb-2 gap-2'>
            <div className='relative w-full'>
                <div className='relative flex gap-2 h-full w-full p-1'>
                    <button onClick={() => setActiveTab('join')}
                    className={`w-1/2 h-[60px] rounded-lg text-white z-20 relative home-buttons
                    ${activeTab === 'join' ? 'home-button-active' : ''}`}>
                        Join Room
                    </button>   

                    <button onClick={() => setActiveTab('create')}
                    className={`w-1/2 h-[60px] rounded-lg text-white z-20 relative home-buttons
                    ${activeTab === 'create' ? 'home-button-active' : ''}`}>
                        Host Room
                    </button>
                </div>

            </div>
            <div className='h-full w-full'>
                {activeTab === 'join' && username &&
                    <JoinRoom username={username}/>
                }
                {activeTab === 'create' && username &&
                    <CreateRoom username={username}/>
                }
            </div>
            
        </div>
    );
}
