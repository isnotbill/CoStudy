import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to CoStudy and rejoin your virtual study rooms, Pomodoro sessions, and study group chats.',
}

export default function Page() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  )
}
