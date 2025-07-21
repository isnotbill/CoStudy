/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import ChatMessage from "@/components/ChatMessage"
import MainHeader from "@/components/MainHeader";
import RoomUser from "@/components/RoomUser";
import Image from "next/image";

import { Client } from '@stomp/stompjs'
import { useParams, useRouter } from "next/navigation";
import  SockJS  from 'sockjs-client';
import apiClient from "../../../../lib/apiClient";
import Popup from "@/components/Popup";
import UpdateRoom from "@/components/UpdateRoom"
import axios from "axios";

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

interface Settings {
    name: string
    publicRoom: boolean
    studyTimeMs: number
    shortBreakTimeMs: number
    longBreakTimeMs: number
    cyclesTillLongBreak: number
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
    const [roomName, setRoomName] = useState("")

    const [inputMessage, setInputMessage] = useState("")
    const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([])
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
    const [loadJoinRoom, setLoadJoinRoom] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(true)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [error, setError] = useState<string|null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [settings, setSettings] = useState<Settings | null>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    const [loadAIMessage, setLoadAIMessage] = useState(false)
    
    const [timer, setTimer] = useState<TimerDto | null>(null)
    const [ms, setMs] = useState(0)

    // True: show timer | False: show settings
    const [toggleSettings, setToggleSettings] = useState(true)

    // For notification detection
    const [lastRunningPhase, setLastRunningPhase] = useState<TimerPhase | null>(null)

    const [showPopUp, setShowPopUp] = useState(false)

    // Check if room code is valid
    useEffect(() => {
        apiClient.get(
            `https://api.costudy.online/room/${roomCode}`,
            {withCredentials: true}
        )
        .then(res => {
            if (!res.data.success)
            {
                router.replace(`/home?reason=invalid_room_code&code=${roomCode}`)
            } else {
                setRoomId(res.data.data.roomId)
                setRoomName(res.data.data.name)
            }
        })
        .catch(() => {
            router.replace(`/home?reason=invalid_room_code&code=${roomCode}`)
        })
    }, [roomCode, router])

    // Fetch user profile
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
    }, [loadJoinRoom, roomCode])

    // Let the user join the room if haven't already
    useEffect(() => {

        async function joinRoom(){
            try {
                await apiClient.post(`/room/${roomCode}/join`)
            } catch (err: any){
                if (err.response?.data?.message === "Duplicate"){return} // TODO DO NOT USE .message to check
                setError("Failed to join room")
            } finally {
                setLoadJoinRoom(false)
            }
        }
        joinRoom() 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Loads all the room messages
    useEffect(() => {
        if (roomId == null){return}
        apiClient.get(
            `https://api.costudy.online/rooms/${roomId}/messages`,
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
            webSocketFactory: () => new SockJS('https://api.costudy.online/ws'),
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

            client.subscribe('/topic/settings/update', msg => {
                const dto: Settings = JSON.parse(msg.body)
                setRoomName(dto.name)
                setSettings(dto)
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                await apiClient.post(`/timer/create/${roomId}`)
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

    async function handleSendAi(){
        const client = stompRef.current
        if (!client?.connected) {return}

        if (!inputMessage.trim() || loadAIMessage === true) {return}

        const msg = inputMessage

        setLoadAIMessage(true)
        setInputMessage("")

        client.publish({
            destination: `/app/room/${roomId}`,
            body: JSON.stringify({
                roomId: roomId,
                userId: profile?.id,
                content: msg,
                username: profile?.username,
                imageIcon: profile?.image,
                type: "USER"
            })
        })

        try {
            const res = await axios.post("/api/chat",
                {
                    messages: [
                        {role: "system", content: "You are an AI tutor for a website named CoStudy, and you are in a virtual study room trying to help other users (students) with their questions. Your word limit is maximum 100 words."},
                        {role: "user", content: msg}
                    ]
                }
            )




            const aiText = res.data.content
            console.log("AI reply: ", aiText)

            client.publish({
                destination: `/app/room/${roomId}`,
                body: JSON.stringify({
                    roomId: roomId,
                    userId: null,
                    content: aiText,
                    username: null,
                    imageIcon: "",
                    type: "AI",
                })
            })
        } catch (err) {
            console.error("AI request failed: ", err)
        } finally {
            setLoadAIMessage(false)
        }

    }

    // Handle kicking user
    async function kickUser(username: string){
        try {
            await apiClient.delete(
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

    // Handle admin deleting room
    const deleteRoom = (roomId : number | null) => {
        if (roomId == null) return

        apiClient.delete(`/room/${roomId}/delete`)
            .then(() => {
                router.replace("/home")
            })
            .catch(err => console.error(err));
    }

    // Handle user leaving room
    const leaveRoom = (roomCode : string) => {
            apiClient.delete(`/room/${roomCode}/leave`)
                .catch(err => console.error(err))
                
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

    // To handle notifications when timer ends
    useEffect(() => {
        if ('Notification' in window){
            Notification.requestPermission().then(permission => {

            console.log('Notification permission:', permission)
            })
        }
    }, [])

    // To initialize settings information

    useEffect(() => {
        async function fetchSettings(){
            if (!roomId) return
            try {
                const res = await apiClient.get(`/settings/${roomId}`)
                setSettings(res.data.data)
            } catch (err: any) {
                console.log(err);
            }
        }
        fetchSettings()

    }, [roomId])

    const prevPhaseRef = useRef<TimerPhase | null>(null) // To detect when timer ends for push notification

    // Push notifications when timer finishes
    useEffect(() => {
        if (timer == null) return
        if (prevPhaseRef.current && prevPhaseRef.current !== timer.phase)
        {
            let body = "Your session has ended"
            if (prevPhaseRef.current === "WORK" && timer.phase === "SHORT_BREAK") {body = "✅ Work done! Time for a quick break."}
            if (prevPhaseRef.current === "LONG_BREAK" && timer.phase === "WORK" ) {body = "📚 Long break's over! Time to focus again."}
            if (prevPhaseRef.current === "WORK" && timer.phase === "LONG_BREAK" ) {body = "🎉 Well done! Enjoy an extended break."}
            if (prevPhaseRef.current === "SHORT_BREAK" && timer.phase === "WORK" ) {body = "📝 Break over, let's resume work."}


            new Notification("Time's up!", {
                body: body,
                icon: '/favicon.ico'
            })
        }
        prevPhaseRef.current = timer.phase
    },[timer])

    // Minutes and seconds for timer
    const mm = String(Math.floor(ms / 60000)).padStart(2,"0")
    const ss = String(Math.floor(ms / 1000) % 60).padStart(2,"0")

    // Display timer details on the header title
    useEffect(() => {
        document.title = `${mm}:${ss} - CoStudy`
    }, [mm,ss])


    // if (loadingMessages) return <p className="text.purple">Loading room...</p>
    if (error){return <p className="text-red-500">{error}</p>}
    return (
  <>
    <main className={`main-bg w-screen min-h-screen flex flex-col items-center
      ${bgClass}`}
    >
      <MainHeader />
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row justify-center items-start gap-6 px-4 md:px-0 my-8">
        {/* Left: Timer & Users */}
        <div className="flex flex-col md:w-[500px] w-full gap-6">
          <div className="card-pane w-full h-auto md:h-[500px] rounded-md p-6 md:p-8 shadow-md flex flex-col justify-center items-center relative">
            <button
              className="absolute top-[10px] right-[10px] settings-button"
              onClick={() => setToggleSettings((prev) => !prev)}
            >
              ⚙️
            </button>
            {toggleSettings ? (
              <>
                <div className="flex flex-col items-center pb-2">
                  <h1 className="text-white text-xl font-medium">{roomName}</h1>
                  <h1 className="text-gray-300/80 text-md">Code: {roomCode}</h1>
                </div>

                <div className="text-white flex flex-wrap gap-2 mb-[-20px] text-lg justify-center">
                  <button
                    className={`hover:text-[#b4b0b8] p-2 rounded-lg ${
                      timer?.phase === "WORK" ? "bg-[rgba(23,21,36,0.49)]" : ""
                    }`}
                    onClick={() => {
                      skipTimer("/app/timer/skipTo", {
                        roomId: roomId,
                        skipToPhase: "WORK",
                      });
                    }}
                  >
                    Work Cycle {currentWorkCycles}
                  </button>
                  <button
                    className={`hover:text-[#b4b0b8] p-2 rounded-lg ${
                      timer?.phase === "SHORT_BREAK" ? "bg-[rgba(23,21,36,0.49)]" : ""
                    }`}
                    onClick={() => {
                      skipTimer("/app/timer/skipTo", {
                        roomId: roomId,
                        skipToPhase: "SHORT_BREAK",
                      });
                    }}
                  >
                    Short Break
                  </button>
                  <button
                    className={`hover:text-[#b4b0b8] p-2 rounded-lg ${
                      timer?.phase === "LONG_BREAK" ? "bg-[rgba(23,21,36,0.49)]" : ""
                    }`}
                    onClick={() => {
                      skipTimer("/app/timer/skipTo", {
                        roomId: roomId,
                        skipToPhase: "LONG_BREAK",
                      });
                    }}
                  >
                    Long Break
                  </button>
                </div>
                <h1 className="text-[rgb(255,255,255)] text-7xl md:text-9xl font-mono py-4">
                  {mm}:{ss}
                </h1>

                <button className="start-button w-full text-center h-[4.5em] text-lg"
                  onClick={() => {
                    if (!timer) {
                      sendTimer("/app/timer/start", { roomId });
                    } else if (timer.status === "PAUSED") {
                      sendTimer("/app/timer/resume", roomId);
                    } else {
                      sendTimer("/app/timer/pause", roomId);
                    }
                  }}
                >
                  {!timer || timer.status === "PAUSED" ? "START" : "PAUSE"}
                </button>
              </>
            ) : (
              <UpdateRoom
                settings={settings}
                roomId={roomId}
                isClientAdmin={roomUsers.find((u) => u.id === profile?.id)?.admin || false}
                setToggleSettings={setToggleSettings}
              />
            )}
          </div>

          <div className="card-pane rounded-md flex flex-col h-[300px] md:h-[269px] shadow-md overflow-hidden">
            <div className="chat-scroll mt-4 flex-1 flex flex-col overflow-y-auto w-full">
              {roomUsers.map((user) => (
                <RoomUser
                  key={user.id}
                  isClient={user.id === profile?.id}
                  isAdmin={user.admin}
                  username={user.username}
                  iconImage={user.image}
                  onKick={() => {
                    kickUser(user.username);
                  }}
                  isAdminClient={roomUsers.find((u) => u.id === profile?.id)?.admin || false}
                />
              ))}
            </div>
            <button
              className="text-red-500 text-xs p-1 self-end m-4 mb-5 border-red-500 border-2 hover:bg-red-500 hover:text-white"
              onClick={() => setShowPopUp(true)}
            >
              LEAVE ROOM
            </button>
          </div>
        </div>

        {/* Right: Chat */}
        <div className="card-pane rounded-md w-full md:w-[500px] h-[500px] md:h-[800px] flex flex-col gap-1 shadow-md">
          <div
            ref={messagesContainerRef}
            className="flex-1 px-3 py-4 md:py-8 flex flex-col gap-4 overflow-y-auto rounded-md chat-scroll"
          >
            {roomMessages.map((m) => (
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

          <form onSubmit={handleSend} className="flex p-2 gap-1">
            <input
              value={inputMessage}
              placeholder="Enter your message"
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 rounded-l-md bg-[rgba(33,28,36,0.6)] text-white px-3 py-3 focus:outline-none"
            />

            <button
              className="relative bg-[rgba(33,28,36,0.6)] text-white px-3 flex items-center justify-center rounded-none"
              type="button"
              onClick={() => handleSendAi()}
              disabled={loadAIMessage}
              title={loadAIMessage ? "Loading AI response..." : "Send to AI tutor"}
            >
              <Image
                src="/images/AI.png"
                alt="AI png"
                width={25}
                height={25}
                className="invert"
              />
            </button>

            <button
              type="submit"
              className="rounded-r-md bg-[rgba(33,28,36,0.6)] text-white px-4 py-3 hover:bg-gray-700 disabled:opacity-50"
              disabled={loadAIMessage}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <Popup show={showPopUp} onClose={() => setShowPopUp(false)}>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white m-3 mt-8 text-center">
            Are you sure you want to leave this room?
          </h1>

          {roomUsers.find((u) => u.id === profile?.id)?.admin && (
            <div className="text-red-500 m-3 text-center">
              WARNING: As an ADMIN, the room will be permanently deleted if you leave
              the room.
            </div>
          )}

          <button
            className="popup-button w-full h-[45px] mt-5"
            onClick={() => {
              if (showPopUp == false) return;
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              roomUsers.find((u) => u.id === profile?.id)?.admin
                ? deleteRoom(roomId)
                : leaveRoom(String(roomCode));
              setShowPopUp(false);
            }}
          >
            Confirm
          </button>
        </div>
      </Popup>
    </main>
  </>
);
}
