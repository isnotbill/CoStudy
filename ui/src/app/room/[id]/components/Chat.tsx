"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoomCard } from "@/components/layout/Card";

const initialMessages = [
  { user: "Sarah", text: "Are we doing 25/5?", time: "10:00", me: false },
  { user: "Mike", text: "Yeah let's stick to standard Pomo.", time: "10:01", me: false },
  { user: "Felix", text: "Sounds good to me!", time: "10:02", me: true },
  { user: "Jessica", text: "I'll be AFK for 5 mins.", time: "10:05", me: false },
  { user: "David", text: "GL everyone!", time: "10:06", me: false },
];

export function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { user: "Felix", text: input, time: "Now", me: true }]);
    setInput("");
  };

  return (
    <RoomCard className="h-full min-h-0 flex flex-col overflow-hidden p-0">
      {/* Header */}
      <div className="p-3 md:p-4 border-b-2 border-slate-100 bg-slate-50 font-bold text-slate-800 shrink-0">
        Live Chat
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 md:p-4 space-y-4 bg-[#fdfbf6]"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 md:gap-3 items-start ${msg.me ? "flex-row-reverse" : ""}`}
          >
            <Avatar className="w-7 h-7 md:w-8 md:h-8 border border-slate-200 mt-1 shrink-0">
              <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${msg.user}`} />
              <AvatarFallback>{msg.user[0]}</AvatarFallback>
            </Avatar>

            <div className={`flex flex-col ${msg.me ? "items-end" : "items-start"} max-w-[85%]`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-bold text-slate-800">{msg.user}</span>
                <span className="text-[10px] text-slate-400">{msg.time}</span>
              </div>

              <div
                className={`
                  px-3 py-2 rounded-2xl text-sm font-medium leading-snug shadow-sm border
                  break-words whitespace-pre-wrap
                  ${msg.me
                    ? "bg-blue-600 text-white border-blue-700 rounded-tr-sm"
                    : "bg-white text-slate-700 border-slate-200 rounded-tl-sm"
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={sendMessage}
        className="p-3 bg-white border-t-2 border-slate-100 flex gap-2 shrink-0"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-xl"
        />
        <Button size="icon" type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </RoomCard>
  );
}
