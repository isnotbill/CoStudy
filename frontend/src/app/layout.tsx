import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cedarville_Cursive } from "next/font/google";
import "./globals.css";


const cedarville = Cedarville_Cursive({
  weight: '400',
  variable: '--font-cedarville',
  subsets: ["latin"]
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "CoStudy",
  description: "Join virtual study rooms with live pomodoro timer and chat with friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cedarville.variable} antialiased`}
        >
        
        {children}
      </body>
    </html>
  );
}
