"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "@/components/ChatMessage"
import MainHeader from "@/components/MainHeader";
import RoomUser from "@/components/RoomUser";

import { Client } from '@stomp/stompjs'
import { useRouter } from "next/navigation";
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
}

interface Profile {
  username: string
  id: number
  image: string
}

interface ClientRoomProp{
    roomId: number
    roomCode: string
}

interface RoomUser{
    id: number
    username: string
    image: string
    admin: boolean
}

// TODO: make ERROR a string[]
export default function ClientRoom({ roomId, roomCode }: ClientRoomProp) {

    // const { roomCode } = useParams()
    const router = useRouter()
    const stompRef = useRef<Client | null>(null)
    // const [roomId, setRoomId] = useState<null|number>(null)
    const [inputMessage, setInputMessage] = useState("")
    const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([])
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
    const [loadJoinRoom, setLoadJoinRoom] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(true)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [error, setError] = useState<string|null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Check if room code is valid
    // useEffect(() => {
    //     apiClient.get(
    //         `http://localhost:8080/room/${roomCode}`,
    //         {withCredentials: true}
    //     )
    //     .then(res => {
    //         if (!res.data.success)
    //         {
    //             notFound()
    //             // router.replace('/roond')
    //         } else {
    //             setRoomId(res.data.data.roomId)
    //         }
    //     })
    //     .catch(() => {
    //         notFound()
    //         // router.replace('/room/noound')
    //     })
    // }, [roomCode, router])

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
                if (err.response.message = "Duplicate"){return}
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
        }

        client.onStompError = frame => {
            console.error('Broker error:', frame.headers['message'], frame.body)
        }

        client.activate()
        stompRef.current = client

    }, [loadingMessages, roomId, loadingProfile])
    
    // Scroll to bottom for every new message
    useEffect(() => {
        const element = messagesContainerRef.current;
        if (element){
            element.scrollTop = element?.scrollHeight;
        }

    }, [roomMessages])

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
                imageIcon: profile?.image
            })
        })

        setInputMessage("")
        
    }

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

    if (loadingMessages) return <p className="text.purple">Loading room...</p>
    if (error){return <p className="text-red-500">{error}</p>}
    return (
        <>
        <main className='bg-[rgb(33,31,48)] w-screen min-h-screen flex flex-col items-center'>
            <MainHeader/>
            <div className="w-full flex justify-center items-start flex-wrap gap-8 my-8">
                <div className="flex flex-col gap-8 w-[500px] h-full">
                    <div className=" bg-[#38354b] w-[500px]  h-[500px] rounded-md p-8 ">
                        <div className="relative w-full h-[50%] rounded-md flex flex-col justify-center items-center">
                            <button className="absolute top-4 right-4 settings-button">⚙️ Settings</button>
                            <h1 className="text-[rgb(255,255,255)] text-[150px] font-mono mt-[180px]">25:00</h1>
                            <button className="start-button">START</button>
                        </div>
                    </div>
                    <div className="chat-scroll bg-[#38354b] overflow-auto rounded-md p-8  flex items-start flex-col gap-4 h-[269px]">


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
                
                <div className=" bg-[#38354b] w-[500px]  h-[800px] flex flex-col gap-1">
                    <div 
                    ref={messagesContainerRef}
                    className="flex-1 px-3 py-8 flex flex-col gap-4 overflow-y-auto rounded-md chat-scroll">


                        {roomMessages.map(m => (
                            <ChatMessage
                            key={m.chatMessageId} 
                            content={m.content}
                            isClient={m.userId === profile?.id}
                            iconImage={m.imageIcon}
                            username={m.username}/>
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