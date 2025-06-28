'use client'
import { useEffect, useState } from 'react';
import apiClient from '../../lib/apiClient';
import { useRouter } from 'next/navigation';

interface SettingsDto {
    name: string,
    publicRoom: boolean,
    studyTimeMs: number,
    shortBreakTimeMs: number,
    longBreakTimeMs: number,
    cyclesTillLongBreak: number,
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


export default function CreateRoom({ settings, roomId, isClientAdmin, setToggleSettings } : { settings: SettingsDto | null, roomId: number | null, isClientAdmin: boolean | null, setToggleSettings: React.Dispatch<React.SetStateAction<boolean>>}) {
    if (settings == null || roomId == null){return <div className='text-xl text-white text-center'>LOADING ...</div>}

    const [createInputVal, setCreateInputVal] = useState<SettingsDto>(settings);
    const [activeSetting, setActiveSetting] = useState<'Pomodoro' | '52/17' | 'Ultradian' | 'Custom'>('Custom')
    const [roomPrivacy, setRoomPrivacy] = useState<'public' | 'private'>(settings.publicRoom ? "public" : "private");

    const [createErrors, setCreateErrors] = useState<Record<string, string>>({});


    const updateRoom = async (roomSettings : SettingsDto) => {
        try {
            const res = await apiClient.post(`/settings/update/${roomId}`, roomSettings);
        } catch (err : any) {
            const errorData = err?.response?.data;

            if (err.response?.status === 400) {
                const fieldErrors = errorData?.data;

                if (fieldErrors && typeof fieldErrors === 'object' && !Array.isArray(fieldErrors)) {
                    setCreateErrors(fieldErrors);
                } else {
                    setCreateErrors({ general: "Invalid input" });
                }
            } else if (err.response?.status === 409) {
                setCreateErrors({ name: errorData?.message || "Room conflict" });
            } else {
                setCreateErrors({ general: errorData?.message || "Something went wrong" });
            }
        }
    }

    const isInvalidChar = (key: string): boolean => {
        return ['e', 'E', '+', '-', '.'].includes(key);
    }
    return (
        <div className='w-full h-full flex flex-col gap-6 justify-between overflow-y-auto chat-scroll mt-10 p-2'>
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className='text-center text-white'>Room Title</h1>
                        <input type="text" value={createInputVal.name} className="bg-[rgba(255,255,255,0.1)] w-full h-[60px] text-white p-1 rounded-md shadow-md text-center font-semibold text-2xl"
                        onChange={(e) => {
                            setCreateInputVal({...createInputVal, name: e.target.value})
                            setCreateErrors({...createErrors, name: ''})
                        }}
                        disabled={!isClientAdmin}
                        />
                        <h1 className='text-red-400 text-[12px] h-[10px]'>
                            {createErrors.name && <p>{createErrors.name}</p>}
                        </h1>
                        
                    </div>
                    {isClientAdmin && (
                        <div className='h-[60px] flex text-white'>
                            <button className={(activeSetting === 'Pomodoro' ? 'create-settings-active' : '') + ' create-settings flex-1'}
                            onClick={(e) => {
                                setActiveSetting('Pomodoro');
                                setCreateInputVal({...presetSettings['pomodoroClassic'], name: createInputVal.name});
                            }}
                            disabled={!isClientAdmin}>
                                
                                Pomodoro
                            </button>
                            <button className={(activeSetting === '52/17' ? 'create-settings-active' : '') + ' create-settings flex-1'}
                            onClick={(e) => {
                                setActiveSetting('52/17');
                                setCreateInputVal({...presetSettings['52/17'], name: createInputVal.name});
                            }}
                            disabled={!isClientAdmin}>
                                52/17
                            </button>
                            <button className={(activeSetting === 'Ultradian' ? 'create-settings-active' : '') + ' create-settings flex-1'}
                            onClick={(e) => {
                                setActiveSetting('Ultradian');
                                setCreateInputVal({...presetSettings['Ultradian'], name: createInputVal.name});
                            }}
                            disabled={!isClientAdmin}>
                                Ultradian
                            </button>
                            <button className={(activeSetting === 'Custom' ? 'create-settings-active' : '') + ' create-settings flex-1'}
                            onClick={(e) => {
                                setActiveSetting('Custom');
                                setCreateInputVal(createInputVal);
                            }}
                            disabled={!isClientAdmin}>
                                Custom
                            </button>
                        </div>

                    )}
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
                            disabled={!isClientAdmin}
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
                            }}
                            disabled={!isClientAdmin}/>
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
                            }}
                            disabled={!isClientAdmin}/>
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
                            }}
                            disabled={!isClientAdmin}/>
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
                            }}
                            disabled={!isClientAdmin}/>
                            <h1 className='text-white'>Private</h1>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input type="checkbox" className='w-4 h-4 bg-[rgba(255,255,255,0.05)] border-2 border-gray-500 rounded appearance-none checked:bg-[rgba(156,243,189,0.92)]  focus:ring-1' 
                            checked={roomPrivacy === 'public'}
                            onChange={() => {
                                setRoomPrivacy('public');
                                setCreateInputVal({...createInputVal, publicRoom: true})
                            }}
                            disabled={!isClientAdmin}/>
                            <h1 className='text-white'>Public</h1>
                        </div>
                    </div>
                    { isClientAdmin && (
                        <button className='start-button '
                        onClick={(e: any) => {
                            e.stopPropagation()
                            updateRoom(createInputVal)
                            setToggleSettings((prev) => !prev)
                        }
                    }
                            disabled={!isClientAdmin}>
                            Update Room
                        </button>
                    )}

                </div>
    )
}
