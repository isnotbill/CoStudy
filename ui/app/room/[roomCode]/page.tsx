import type { Metadata } from 'next'
import { Suspense } from 'react'
import RoomClient from './RoomClient'

export const metadata: Metadata = {
  title: 'Study Room',
  description: 'You\'re in a CoStudy room. Stay focused with a synced Pomodoro timer, group chat, and an AI study assistant.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return (
    <Suspense>
      <RoomClient />
    </Suspense>
  )
}
