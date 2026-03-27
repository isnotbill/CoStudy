import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Cedarville_Cursive } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const cedarville = Cedarville_Cursive({
  weight: '400',
  variable: '--font-cedarville-src',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'CoStudy, Virtual Study Rooms with Pomodoro Timer & AI Tutor',
    template: '%s | CoStudy',
  },
  description:
    'CoStudy lets you create or join virtual study rooms with a synced Pomodoro timer, real-time chat, and an AI study assistant. Study with friends, anywhere.',
  keywords: [
    'study together',
    'virtual study room',
    'pomodoro timer',
    'study with friends',
    'online study group',
    'productivity',
    'focus',
    'CoStudy',
  ],
  openGraph: {
    type: 'website',
    siteName: 'CoStudy',
    title: 'CoStudy — Study Together, Stress-Free',
    description:
      'Create or join virtual study rooms with a synced Pomodoro timer, real-time chat, and an AI study assistant.',
    url: 'https://costudy.online',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoStudy — Study Together, Stress-Free',
    description:
      'Create or join virtual study rooms with a synced Pomodoro timer, real-time chat, and an AI study assistant.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <head>
        {/* Anti-flash: apply stored theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('costudy-theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${geist.variable} ${cedarville.variable} h-full antialiased`} suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
