"use client";

import Header from "@/components/Header";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export const tech = [
  { name: "Next.js", src: "/images/techstack/nextjs.png" },
  { name: "TypeScript", src: "/images/techstack/typescript.png" },
  { name: "React", src: "/images/techstack/react.png" },
  { name: "TailwindCSS", src: "/images/techstack/tailwind.png" },
  { name: "Java", src: "/images/techstack/java.png" },
  { name: "Spring Boot (REST + WebSocket/STOMP)", src: "/images/techstack/springboot.png" },
  { name: "Spring Security", src: "/images/techstack/spring.png" },
  { name: "MySQL", src: "/images/techstack/mysql.png" },
  { name: "AWS", src: "/images/techstack/aws.png" },
];

export const devs = [
  {
    name: "Bill Huynh‑Lu",
    role: "Software Engineering Student",
    img: "/images/bill.jpg",
    github:"https://github.com/isnotbill"
  },
  {
    name: "Rei Shibatani",
    role: "Software Engineering Student",
    img: "/images/rei.jpg",
    github: "https://github.com/reiiiiiiiiii",
  },
];

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};


export default function AboutPage() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>

      <main className=" overflow-y-hidden flex flex-col bg-[rgb(48,36,88)] text-[#f2f7fd] overflow-x-hidden select-none">



        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-5xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12"
        >
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold font-kumbh leading-tight">
              Study together, <span className="text-[#c7b6ff]">anywhere in the world</span>
            </h2>
            <p className="text-lg md:text-xl leading-relaxed font-light">
              CoStudy lets students create or join public and private virtual study rooms. Chat in real‑time, keep everyone on track with a synchronized Pomodoro timer (fully customisable), and ask the AI tutor when you hit a roadblock.
            </p>
            <p className="text-lg md:text-xl leading-relaxed font-light">Focus feels better when you share it.</p>
          </div>

          <motion.div
            onClick={() => setLightboxSrc("/images/aboutimg1.png")}
            whileHover={{ scale: 1.03 }}
            className="flex-1 relative h-[280px] md:h-[360px] cursor-pointer rounded-xl overflow-hidden shadow-xl bg-[#5d4e8c]/40"
          >
            <Image
              src="/images/aboutimg1.png"
              alt="Study‑room screenshot"
              fill
              sizes="(min-width:1024px) 45vw, 90vw"
              quality={95}
              className="object-cover"
            />
          </motion.div>
        </motion.section>

    
        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-5xl mx-auto px-6 pb-24 flex flex-col md:flex-row-reverse items-center gap-12"
        >
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl md:text-4xl font-semibold">Stay on pace with live timers</h3>
            <p className="text-lg md:text-xl leading-relaxed font-light">
              The shared timer keep everyone synced, whether you love Pomodoro, 52/17 or your own rhythm. Gentle alerts appear for every user in the room.
            </p>
          </div>

          <motion.div
            onClick={() => setLightboxSrc("/images/aboutimg2.png")}
            whileHover={{ scale: 1.03 }}
            className="flex-1 relative h-[280px] md:h-[360px] rounded-xl bg-[#5d4e8c]/40 border border-[#8a7ed6]/40 backdrop-blur-md overflow-hidden cursor-pointer"
          >
            
            <Image
              src="/images/aboutimg2.png"
              alt="Timer screenshot"
              fill
              quality={95}
              className="object-cover"
            />
          </motion.div>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className=" bg-gradient-to-br from-[#7464ae] via-[#644fb1] to-[#5c4d94] w-full py-20 px-6"
        >
          <div className="max-w-5xl mx-auto text-center space-y-16">
            <h2 className="text-4xl md:text-5xl font-bold">The Developers</h2>

            <div className="grid sm:grid-cols-2 gap-10">
              {devs.map((dev) => (
                <motion.div
                  key={dev.name}
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  className="relative rounded-2xl bg-[#503f83]/60 p-8 pt-28 shadow-lg backdrop-blur-md overflow-hidden"
                >
                  <Image
                    src={dev.img}
                    alt={dev.name}
                    width={160}
                    height={160}
                    className="absolute -top-20 left-1/2 -translate-x-1/2 rounded-full border-4 border-[#8a7ed6] object-cover shadow-md"
                  />
                  <h3 className="text-2xl font-semibold mt-4">{dev.name}</h3>
                  <p className="text-sm uppercase tracking-wide text-[#c7b6ff] mb-3">{dev.role}</p>
                  <a href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 inline-flex items-center gap-2 rounded-full
                  bg-[#8a7ed6] px-4 py-2 font-medium text-[rgb(70,60,102)]
                  transition-colors hover:bg-[#b4aaff]"
                  >
                    <Image 
                    src="/images/techstack/github.png"
                    alt="github image"
                    width={20}
                    height={20}
                    className="invert group-hover:invert-0"
                    />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>


        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-6xl mx-auto px-6 py-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Built with...</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 place-items-center">
            {tech.map((t) => (
              <motion.div
                key={t.name}
                variants={{ initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                  <Image src={t.src} alt={`${t.name} logo`} fill className="object-contain" />
                </div>
                <span className="text-sm md:text-base font-light text-center">{t.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <AnimatePresence>
          {lightboxSrc && (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxSrc(null);
              }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out"
            >
              <Image
                src={lightboxSrc}
                alt="Full‑size preview"
                width={1600}
                height={1000}
                className="max-h-[90vh] w-auto rounded-lg shadow-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
