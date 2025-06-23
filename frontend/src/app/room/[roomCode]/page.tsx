"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import ChatMessage from "@/components/ChatMessage"
import MainHeader from "@/components/MainHeader";
import RoomUser from "@/components/RoomUser";

import { Client } from '@stomp/stompjs'
import { useParams, useRouter } from "next/navigation";
import  SockJS  from 'sockjs-client';
import apiClient from "../../../../lib/apiClient";


interface ChatMessage{
    chatMessageId: number,
    roomId: number,
    userId: number,
    content: string,
    sentAt: string,
    username: string,
    imageIcon: string,
    type: string
}

interface Profile {
  username: string
  id: number
  image: string
}

interface RoomUser{
    id: number
    username: string
    image: string
    admin: boolean
}

type TimerPhase = "WORK" | "SHORT_BREAK" | "LONG_BREAK"
type TimerStatus = "RUNNING" | "PAUSED"

interface TimerDto {
    phase: TimerPhase
    status: TimerStatus
    startedAt: string | null
    durationMs: number
    workCyclesDone: number
}

const remaining = (t: TimerDto) => {
    if (t.status !== "RUNNING" || !t.startedAt) {
        return t.durationMs
    }
    return Math.max(0,
        t.durationMs - (Date.now() - new Date(t.startedAt).getTime())
    )
}

// TODO: make ERROR a string[]
export default function ClientRoom() {

    const { roomCode } = useParams()
    const router = useRouter()
    const stompRef = useRef<Client | null>(null)
    const [roomId, setRoomId] = useState<null|number>(null)
    const [inputMessage, setInputMessage] = useState("")
    const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([])
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
    const [loadJoinRoom, setLoadJoinRoom] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(true)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [error, setError] = useState<string|null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    
    const [timer, setTimer] = useState<TimerDto | null>(null)
    const [ms, setMs] = useState(0);

    const [lastRunningPhase, setLastRunningPhase] = useState<TimerPhase | null>(null)


    // Check if room code is valid
    useEffect(() => {
        apiClient.get(
            `http://localhost:8080/room/${roomCode}`,
            {withCredentials: true}
        )
        .then(res => {
            if (!res.data.success)
            {
                router.replace("/room/not-found")
            } else {
                setRoomId(res.data.data.roomId)
            }
        })
        .catch(() => {
            router.replace("/room/not-found")
        })
    }, [roomCode, router])

    // Fetch profile
    useEffect(() => {
        async function fetchProfile() {
        try {
            const response = await apiClient.get('/user')
            setProfile(response.data)
        } catch (err: any) {
            setError(err.message || 'Failed to fetch user profile')
        } 
        finally {
            setLoadingProfile(false)
        }
        }
        fetchProfile()
    }, [])

    // Loads all users
    useEffect(() => {
        if (loadJoinRoom){return}
        async function fetchRoomUsers(){
            try {
                const resUsers = await apiClient.get(`/room/${roomCode}/users`)
                const data = resUsers.data.data
                setRoomUsers(data)
            } catch {
                setError("Failed to load")
            }
        }
        fetchRoomUsers() 
    }, [loadJoinRoom])

    // Let the user join the room if haven't already
    useEffect(() => {

        async function joinRoom(){
            try {
                const resUsers = await apiClient.post(`/room/${roomCode}/join`)
            } catch (err: any){
                if (err.response?.data?.message === "Duplicate"){return} // TODO DO NOT USE .message to check
                setError("Failed to join room")
            } finally {
                setLoadJoinRoom(false)
            }
        }
        joinRoom() 
    }, [])

    // Loads all the room messages
    useEffect(() => {
        if (roomId == null){return}
        apiClient.get(
            `http://localhost:8080/rooms/${roomId}/messages`,
            {withCredentials: true}
        )
        .then(res => {
            const data: ChatMessage[] = res.data.data
            setRoomMessages(data)
            
        })
        .catch(() => setError("Failed to load chat"))
        .finally(() => setLoadingMessages(false))

    }, [roomId])

    // Connects the websocket
    useEffect(() => {
        if (loadingMessages || roomId == null || loadingProfile) {return}


        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            debug: str => console.log('[STOMP]', str),
        })

        client.onConnect = () => {
            client.subscribe(`/topic/room/${roomId}`, msg => {
                const chat: ChatMessage = JSON.parse(msg.body)
                setRoomMessages(ms => [...ms, chat])
            })

            client.subscribe(`/topic/room/${roomCode}/join`, msg => {
                const newUser: RoomUser = JSON.parse(msg.body)
                setRoomUsers(prev => [...prev, newUser])
            })

            client.subscribe(`/topic/room/${roomCode}/kick`, msg => {
                const kickedUsername: string = msg.body
                setRoomUsers(u => u.filter(user => user.username !== kickedUsername))

                if (kickedUsername == profile?.username){
                    client.deactivate()
                    router.replace("/home")
                }
            })

            client.subscribe(`/topic/room/${roomId}/timer`, msg => {
                const dto: TimerDto = JSON.parse(msg.body)
                setTimer(dto)
                setMs(remaining(dto))
            })

            client.subscribe('/user/queue/timer', msg => {
                const dto: TimerDto = JSON.parse(msg.body)
                setTimer(dto)
                setMs(remaining(dto))
            })

            client.publish({
            destination: "/app/timer/status",
            body: String(roomId)})

        }

        client.onStompError = frame => {
            console.error('Broker error:', frame.headers['message'], frame.body)
        }

        client.activate()
        stompRef.current = client

        return () => {
            client.deactivate()
        }

    }, [loadingMessages, roomId, loadingProfile])

    // Local clock ticking for timer
    useEffect(() => {
        if (!timer || timer.status !== "RUNNING"){return}
        const id = setInterval(() => setMs(remaining(timer)), 1000)
        return () => clearInterval(id);
    }, [timer])
    
    // Create Timer if doesn't exist already
    useEffect(() => {
        if (roomId == null){return}
        async function createTimer(){
            try {
                const res = await apiClient.post(`/timer/create/${roomId}`)
            } catch (err : any) {
                setError(err);
            }
        }
        createTimer()

    }, [roomId])

    // Scroll to bottom for every new message
    useEffect(() => {
        const element = messagesContainerRef.current;
        if (element){
            element.scrollTop = element?.scrollHeight;
        }

    }, [roomMessages])

    const sendTimer = (dest: string, body: any) => {
        stompRef.current?.publish({
            destination: dest,
            body: typeof body === "string" ? body : JSON.stringify(body)
        })
    }

    const skipTimer = (dest: string, body: {roomId : number | null, skipToPhase: TimerPhase}) => {
        if (body.roomId == null){return}
        stompRef.current?.publish({
            destination: dest,
            body: typeof body === "string" ? body : JSON.stringify(body)
        })

    }

    // Handle sending chat messages to backend
    function handleSend(e: React.FormEvent){
        e.preventDefault()
        if (!inputMessage.trim()){return}


        const client = stompRef.current
        if (!client?.connected){return;}

        console.log(inputMessage)

        client.publish({
            destination: `/app/room/${roomId}`,
            body: JSON.stringify({
                roomId: roomId,
                userId: profile?.id,
                content: inputMessage,
                username: profile?.username,
                imageIcon: profile?.image,
                type: "USER"
            })
        })

        setInputMessage("")
        
    }

    // Handle kicking user
    async function kickUser(username: string){
        try {
            const res = await apiClient.delete(
                `/room/${roomCode}/kick`,
                {
                    data: username,
                    headers: {"Content-Type": "text/plain"}
                }
            )
            setRoomUsers(u => u.filter(user => user.username !== username))

        } catch (err: any ){
            console.error("Error to kick user: ", err)
        }
    }

    // Update the state whenever the timer is RUNNING.
    // This is needed for bgClass, otherwise background incorrectly fades out
    useEffect(() => {
        if (timer?.status === "RUNNING"){
            setLastRunningPhase(timer.phase)
        }
    }, [timer])

    // Change background className depending on the phase
    const bgClass = useMemo(() => {
        if (!timer) return "";

        const phaseKey = timer.status === "RUNNING"
            ? timer.phase
            : lastRunningPhase

        const phase = (() => {
            switch (phaseKey) {
                case "WORK": return "work-phase"
                case "SHORT_BREAK": return "short-break-phase"
                case "LONG_BREAK": return "long-break-phase"
                default: return ""
            }
        })()

        return timer.status === "RUNNING"
        ? `${phase} phase-active`
        : phase;

    }, [timer, lastRunningPhase])

    // To display the current phase of the timer
    const currentWorkCycles = useMemo(() => {
        if (!timer || timer.phase !== "WORK") return ""

        return "#" + (timer.workCyclesDone + 1)
    }, [timer])

    
    const mm = String(Math.floor(ms / 60000)).padStart(2,"0")
    const ss = String(Math.floor(ms / 1000) % 60).padStart(2,"0")

    if (loadingMessages) return <p className="text.purple">Loading room...</p>
    if (error){return <p className="text-red-500">{error}</p>}
    return (
        <>
        <main className={`main-bg w-screen min-h-screen flex flex-col items-center
        ${bgClass}`}
        >
            <MainHeader/>
            <div className="w-full flex justify-center items-start flex-wrap gap-8 my-8">
                <div className="flex flex-col gap-8 w-[500px] h-full">
                    <div className=" card-pane w-[500px]  h-[500px] rounded-md p-8 ">
                        <div className="relative w-full h-[50%] rounded-md flex flex-col justify-center items-center gap-10">
                            <button className="absolute top-4 right-4 settings-button">⚙️ Settings</button>
                            <div className="text-white flex  gap-2 mt-[260px] mb-[-20px] text-lg">
                                <button className={`hover:text-[#b4b0b8] p-2 rounded-lg ${
                                    timer?.phase === "WORK" ? "bg-[rgba(23,21,36,0.49)]" : ""
                                }`}
                                onClick={() => {skipTimer("/app/timer/skipTo", {
                                    roomId: roomId,
                                    skipToPhase: "WORK"
                                })}}
                                >Work Cycle {currentWorkCycles}</button>
                                <button className={`hover:text-[#b4b0b8] p-2 rounded-lg ${
                                    timer?.phase === "SHORT_BREAK" ? "bg-[rgba(23,21,36,0.49)]" : ""
                                }`}
                                onClick={() => {skipTimer("/app/timer/skipTo", {
                                    roomId: roomId,
                                    skipToPhase: "SHORT_BREAK"
                                })}}>Short Break</button>
                                <button className={`hover:text-[#b4b0b8] p-2 rounded-lg ${
                                    timer?.phase === "LONG_BREAK" ? "bg-[rgba(23,21,36,0.49)]" : ""
                                }`}
                                onClick={() => {skipTimer("/app/timer/skipTo", {
                                    roomId: roomId,
                                    skipToPhase: "LONG_BREAK"
                                })}}>Long Break</button>
                            </div>
                            <h1 className="text-[rgb(255,255,255)] text-9xl font-mono ">{mm}:{ss}</h1>
                            
                            <button className="start-button"
                                    onClick={() => {
                                        if (!timer){
                                            sendTimer("/app/timer/start", { roomId })
                                        } else if (timer.status === 'PAUSED') {
                                            sendTimer("/app/timer/resume", roomId)
                                        } else {
                                            sendTimer("/app/timer/pause", roomId)
                                        }
                                        }}>
                            {!timer || timer.status === 'PAUSED' ? 'START' : 'PAUSE'}
                            </button>

                        </div>
                    </div>
                    <div className="chat-scroll card-pane overflow-auto rounded-md p-8  flex items-start flex-col gap-4 h-[269px]">

                        {roomUsers.map(user => (
                            <RoomUser
                            key={user.id}   
                            isClient={user.id == profile?.id}
                            isAdmin={user.admin}
                            username= {user.username}
                            iconImage= {user.image}
                            onKick={() => {kickUser(user.username)}}
                            isAdminClient={roomUsers.find(u => u.id === profile?.id)?.admin || false}
                            />
                        ))}
                    </div>
                </div>
                
                <div className=" card-pane w-[500px]  h-[800px] flex flex-col gap-1">
                    <div 
                    ref={messagesContainerRef}
                    className="flex-1 px-3 py-8 flex flex-col gap-4 overflow-y-auto rounded-md chat-scroll">


                        {roomMessages.map(m => (
                            <ChatMessage
                            key={m.chatMessageId} 
                            content={m.content}
                            isClient={m.userId === profile?.id}
                            iconImage={m.imageIcon}
                            username={m.username}
                            type={m.type}
                            />
                        ))}
                    </div>

                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            value={inputMessage}
                            placeholder="Enter your message"
                            onChange={(e) => setInputMessage(e.target.value)}
                            className="flex-auto border border-gray-600 bg-transparent text-white px-1 py-2 focus:outline-none"/>
                            
                        <button
                            type="submit"
                            className="border border-gray-600 bg-transparent text-white px-4 py-1 rounded hover:bg-gray-700">
                            Send</button>
                    </form>
                </div>
            </div>
            
            
        </main>
        </>
    );
}