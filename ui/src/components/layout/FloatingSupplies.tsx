"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Book, 
  Coffee, 
  Pencil, 
  Paperclip, 
  Star, 
  Highlighter 
} from "lucide-react";

export const FloatingSupplies = () => {
  const items = [
    { Icon: Pencil, color: "text-blue-400", left: "10%", delay: 0, duration: 25 },
    { Icon: Book, color: "text-red-400", left: "80%", delay: 2, duration: 28 },
    { Icon: Coffee, color: "text-stone-400", left: "30%", delay: 4, duration: 30 },
    { Icon: Paperclip, color: "text-green-400", left: "60%", delay: 1, duration: 22 },
    { Icon: Star, color: "text-yellow-500", left: "5%", delay: 3, duration: 26 },
    { Icon: Highlighter, color: "text-pink-400", left: "90%", delay: 5, duration: 24 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ y: "110vh", rotate: 0, x: 0 }}
          animate={{ 
            y: "-10vh", 
            rotate: [0, 360, -360],
            x: ["-20px", "20px", "-20px"] 
          }}
          transition={{ 
            duration: item.duration, 
            repeat: Infinity, 
            delay: item.delay,
            ease: "linear" 
          }}
          className={`absolute top-0 ${item.color} opacity-40`}
          style={{ left: item.left }}
        >
          <item.Icon 
            size={40 + index * 5} 
            strokeWidth={2.5} 
            style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.1))' }} 
          />
        </motion.div>
      ))}
    </div>
  );
};