"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface SketchButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const SketchButton = ({ 
  children, 
  className = "", 
  variant = "primary", 
  ...props 
}: SketchButtonProps) => {
  const baseStyle = "relative inline-flex items-center justify-center px-8 py-4 font-bold text-lg transition-all outline-none group rounded-xl";
  
  const variants = {
    primary: "text-white bg-blue-600 border-2 border-dashed border-blue-800 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    secondary: "text-stone-800 bg-yellow-100 border-2 border-dashed border-stone-400 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.98, translateY: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      style={{ rotate: "1deg" }}
      {...props}
    >
      {children}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-current opacity-30 group-hover:w-3/4 transition-all duration-300 rounded-full" />
    </motion.button>
  );
};