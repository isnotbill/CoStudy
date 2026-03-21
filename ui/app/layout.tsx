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
  title: 'CoStudy',
  description: 'Join virtual study rooms with live pomodoro timer and chat with friends.',
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
