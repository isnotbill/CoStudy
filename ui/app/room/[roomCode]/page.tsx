import { Suspense } from 'react'
import RoomClient from './RoomClient'

export default function Page() {
  return (
    <Suspense>
      <RoomClient />
    </Suspense>
  )
}
