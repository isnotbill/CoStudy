"use client";

import React from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { SketchButton } from "@/components/ui/SketchButton";
import { ScribbleUnderline } from "@/components/ui/underline";

export function HeroSection() {
  return (
    <main className="relative z-10 max-w-4xl mx-auto px-3 pt-32 pb-32 text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="relative"
      >
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-stone-900 leading-[0.9] mb-8">
          Study Together
          <br />
          <span
            className="relative inline-block text-blue-600 mx-2"
            style={{ fontFamily: "var(--font-cedarville)" }}
          >
            Stress-Free
            <ScribbleUnderline />
          </span>
        </h1>

        <p className="text-xl sm:text-2xl font-medium text-stone-700 leading-relaxed max-w-2xl mx-auto mb-12">
          Join virtual study groups, stay motivated, and collaborate with friends.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative">
          <SketchButton className="gap-3 w-full sm:w-auto">
            <PlayCircle size={24} strokeWidth={3} />
            Join a Room
          </SketchButton>

          <SketchButton variant="secondary" className="w-full sm:w-auto">
            Create Room
          </SketchButton>
        </div>
      </motion.div>
    </main>
  );
}
