'use client'
import { useState } from 'react'
import CreateRoom from './Home/CreateRoom'
import JoinRoom from './Home/JoinRoom'

interface JoinCreateRoomProps {
  username?: string
}

export default function JoinCreateRoom({ username }: JoinCreateRoomProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create')

  return (
    <div className="w-full h-full">
      {/* Tab Buttons */}
      <div className="bg-white/10 border border-white/20 rounded-full p-1 flex items-center mb-4">
        <button
          onClick={() => setActiveTab('join')}
          className={`w-1/2 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'join'
              ? 'bg-white text-black shadow-md'
              : 'text-white hover:text-purple-200'
          }`}
        >
          Join Room
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`w-1/2 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'create'
              ? 'bg-white text-black shadow-md'
              : 'text-white hover:text-purple-200'
          }`}
        >
          Host Room
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full flex-1">
        {activeTab === 'join' && username && <JoinRoom username={username} />}
        {activeTab === 'create' && username && <CreateRoom username={username} />}
      </div>
    </div>
  )
}
