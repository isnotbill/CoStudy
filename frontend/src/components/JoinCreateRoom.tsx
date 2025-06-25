'use client'
import { use, useEffect, useState } from 'react';
import apiClient from '../../lib/apiClient';
import { join } from 'path';
import { useRouter } from 'next/navigation';

interface SettingsDto {
    name: string,
    publicRoom: boolean,
    studyTimeMs: number,
    shortBreakTimeMs: number,
    longBreakTimeMs: number,
    cyclesTillLongBreak: number,
}

interface JoinCreateRoomProps {
  username?: string;
}

const presetSettings: Record<string, SettingsDto> = {
  "pomodoroClassic": {
    name: "",
    publicRoom: false,
    studyTimeMs: 25,
    shortBreakTimeMs: 5,
    longBreakTimeMs: 15,
    cyclesTillLongBreak: 4,
  },
  "52/17": {
    name: "",
    publicRoom: false,
    studyTimeMs: 52,
    shortBreakTimeMs: 17,
    longBreakTimeMs: 30,
    cyclesTillLongBreak: 4,
  },
  "Ultradian": {
    name: "",
    publicRoom: false,
    studyTimeMs: 90,
    shortBreakTimeMs: 20,
    longBreakTimeMs: 60,
    cyclesTillLongBreak: 3,
  },
};


export default function JoinCreateRoom({ username }: JoinCreateRoomProps) {
    const defaultRoomName = `${username}'s room`;

    const [activeTab, setActiveTab] = useState<'create' | 'join'>('create')

    const [joinInputVal, setJoinInputVal] = useState('');

    const [createInputVal, setCreateInputVal] = useState<SettingsDto>(presetSettings['pomodoroClassic']);
    const [activeSetting, setActiveSetting] = useState<'Pomodoro' | '52/17' | 'Ultradian' | 'Custom'>('Pomodoro')
    const [roomPrivacy, setRoomPrivacy] = useState<'public' | 'private'>('private');

    const [joinErrorMsg, setJoinErrorMsg] = useState('');
    const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    useEffect(() => {
        if (username && createInputVal.name === '') {
            setCreateInputVal(prev => ({ ...prev, name: `${username}'s room` }));
        }
    }, [username]);


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

    const createRoom = async (roomSettings : SettingsDto) => {
        try {
            const res = await apiClient.post(`/room/create`, roomSettings);
            router.push(`/room/${res.data.data}`);
        } catch (err : any) {
            if(err.response.status === 400) {
                setCreateErrors(err.response.data.data)
            }
            if(err.response && err.response.status === 409) {
                setCreateErrors(err.response.data);
            } else {
                setJoinErrorMsg(err.response?.data?.message || "Something went wrong");
            }
        }
    }

    const isInvalidChar = (key: string): boolean => {
        return ['e', 'E', '+', '-', '.'].includes(key);
    }

    return (
        <div className='bg-[rgba(255,255,255,0.1)] flex items-center w-full max-w-[480px] h-[650px] flex-col rounded-md overflow-hidden px-2 gap-4'>
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
                {activeTab === 'join' && 
                <div className='h-full w-full flex flex-col'>
                    <div className='w-full h-[60px]'>
                        <div className='text-center text-white'>Enter Room Code</div>
                        <input type="text" value={joinInputVal} className="bg-[rgba(255,255,255,0.1)] w-full h-full text-white p-1 flex-1 rounded-md text-center font-bold text-xl"
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
                         
                    </div>
                    {joinErrorMsg && (
                            <div className="text-red-400 mt-8 text-center">
                                {joinErrorMsg}
                            </div>
                    )}
                    
                        
                </div>
                }
                {activeTab === 'create' &&
                <div className='w-full h-full flex flex-col gap-6 justify-center'>
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className='text-center text-white'>Room Title</h1>
                        <input type="text" value={createInputVal.name} className="bg-[rgba(255,255,255,0.1)] w-full h-[60px] text-white p-1 rounded-md shadow-md text-center font-semibold text-2xl"
                        onChange={(e) => {
                            setCreateInputVal({...createInputVal, name: e.target.value})
                            setCreateErrors({...createErrors, name: ''})
                        }}/>
                        <h1 className='text-red-400 text-[12px] h-[10px]'>
                            {createErrors.name && <p>{createErrors.name}</p>}
                        </h1>
                        
                    </div>
                    
                    <div className='h-[60px] flex text-white'>
                        <button className={(activeSetting === 'Pomodoro' ? 'create-settings-active' : '') + ' create-settings flex-1'}
                        onClick={(e) => {
                            setActiveSetting('Pomodoro');
                            setCreateInputVal({...presetSettings['pomodoroClassic'], name: createInputVal.name});
                        }}>
                            Pomodoro
                        </button>
                        <button className={(activeSetting === '52/17' ? 'create-settings-active' : '') + ' create-settings flex-1'}
                        onClick={(e) => {
                            setActiveSetting('52/17');
                            setCreateInputVal({...presetSettings['52/17'], name: createInputVal.name});
                        }}>
                            52/17
                        </button>
                        <button className={(activeSetting === 'Ultradian' ? 'create-settings-active' : '') + ' create-settings flex-1'}
                        onClick={(e) => {
                            setActiveSetting('Ultradian');
                            setCreateInputVal({...presetSettings['Ultradian'], name: createInputVal.name});
                        }}>
                            Ultradian
                        </button>
                        <button className={(activeSetting === 'Custom' ? 'create-settings-active' : '') + ' create-settings flex-1'}
                        onClick={(e) => {
                            setActiveSetting('Custom');
                            setCreateInputVal(createInputVal);
                        }}>
                            Custom
                        </button>
                    </div>
                    <div className='flex gap-2 justify-between'>
                        <div className='flex flex-col gap-1 flex-1'>
                            <h1 className='text-white'>Study length</h1>
                            <input type="number" 
                            value={createInputVal.studyTimeMs}
                            onChange={(e) => {
                                setCreateInputVal({...createInputVal, studyTimeMs: parseInt(e.target.value) || 0})
                                setActiveSetting('Custom');
                                setCreateErrors({...createErrors, studyTimeMs: ''})
                            }}
                            className='settings-input text-white shadow-md' 
                            onKeyDown={(e) => {
                                if(isInvalidChar(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            />
                            <h1 className='text-red-400 text-[12px] h-[10px]'>
                                {createErrors.studyTimeMs && <p>{createErrors.studyTimeMs}</p>}
                            </h1>  
                        </div>
                        <div className='flex flex-col flex-1 gap-1'>
                            <h1 className='text-white'>Short break length</h1>
                            <input type="number"
                            value={createInputVal.shortBreakTimeMs}
                            onChange={(e) => {
                                setCreateInputVal({...createInputVal, shortBreakTimeMs: parseInt(e.target.value) || 0})
                                setActiveSetting('Custom');
                                setCreateErrors({...createErrors, shortBreakTimeMs: ''})
                            }}
                            className='settings-input text-white shadow-md' 
                            onKeyDown={(e) => {
                                if(isInvalidChar(e.key)) {
                                    e.preventDefault();
                                }
                            }}/>
                            <h1 className='text-red-400 text-[12px] h-[10px]'>
                                {createErrors.shortBreakTimeMs && <p>{createErrors.shortBreakTimeMs}</p>}
                            </h1>  
                        </div>
                        
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex flex-col flex-1 gap-1'>
                            <h1 className='text-white'>Cycles till long break</h1>
                            <input type="number"
                            value={createInputVal.cyclesTillLongBreak}
                            onChange={(e) => {
                                setCreateInputVal({...createInputVal, cyclesTillLongBreak: parseInt(e.target.value) || 0})
                                setActiveSetting('Custom');
                                setCreateErrors({...createErrors, cyclesTillLongBreak: ''})
                            }}
                            className='settings-input text-white shadow-md' 
                            onKeyDown={(e) => {
                                if(isInvalidChar(e.key)) {
                                    e.preventDefault();
                                }
                            }}/>
                            <h1 className='text-red-400 text-[12px] h-[10px]'>
                                {createErrors.cyclesTillLongBreak && <p>{createErrors.cyclesTillLongBreak}</p>}
                            </h1>  
                        </div>
                        <div className='flex flex-col flex-1 gap-1'>
                            <h1 className='text-white'>Long break length</h1>
                            <input type="number"
                            value={createInputVal.longBreakTimeMs}
                            onChange={(e) => {
                                setCreateInputVal({...createInputVal, longBreakTimeMs: parseInt(e.target.value) || 0})
                                setActiveSetting('Custom');
                                setCreateErrors({...createErrors, longBreakTimeMs: ''})
                            }}
                            className='settings-input text-white shadow-md' 
                            onKeyDown={(e) => {
                                if(isInvalidChar(e.key)) {
                                    e.preventDefault();
                                }
                            }}/>
                            <h1 className='text-red-400 text-[12px] h-[10px]'>
                                {createErrors.longBreakTimeMs && <p>{createErrors.longBreakTimeMs}</p>}
                            </h1>  
                        </div>
                    </div>
                    <div className='flex justify-evenly'>
                        <div className='flex gap-2 items-center'>
                            <input type="checkbox" className='w-4 h-4 bg-[rgba(255,255,255,0.05)] border-2 border-gray-500 rounded appearance-none checked:bg-[rgba(156,243,189,0.92)]  focus:ring-1' 
                            checked={roomPrivacy === 'private'}
                            onChange={() => {
                                setRoomPrivacy('private');
                                setCreateInputVal({...createInputVal, publicRoom: false})
                            }}/>
                            <h1 className='text-white'>Private</h1>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input type="checkbox" className='w-4 h-4 bg-[rgba(255,255,255,0.05)] border-2 border-gray-500 rounded appearance-none checked:bg-[rgba(156,243,189,0.92)]  focus:ring-1' 
                            checked={roomPrivacy === 'public'}
                            onChange={() => {
                                setRoomPrivacy('public');
                                setCreateInputVal({...createInputVal, publicRoom: true})
                            }}/>
                            <h1 className='text-white'>Public</h1>
                        </div>
                    </div>
                    <button className='start-button'
                    onClick={() => createRoom(createInputVal)}>
                        Create Room
                    </button>
                </div>

                
                }
            </div>
            
        </div>
    );
}
