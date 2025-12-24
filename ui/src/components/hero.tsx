"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SignupForm } from "./signup-form";
import DotGridBackground from "./ui/background"

export const Hero = () => {
  return (
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-glow-mesh pt-20 pb-5">
        <div className="absolute inset-0 z-0 from-[#513d9b]">
          <DotGridBackground />
        </div>

        <div className="container px-4 md:px-6 z-10">
          <div className="flex items-center justify-center gap-32 md:gap-16 flex-col mt-30 md:mt-10 lg:flex-row">
            
            <div className="flex flex-col space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <span style={{ fontFamily: 'var(--font-cedarville)'}} className="text-left text-primary italic font-display font-extralight text-5xl">Study Together, Stress-Free</span>
                {/* <p className="font-cursive text-2xl text-purple-500 md:text-3xl">
                  CoStudy makes it social.
                </p> */}
              </div>

              <p className="max-w-[480px] text-lg text-muted-foreground leading-relaxed">
                Join virtual study groups, stay motivated, and collaborate with friends.
              </p>

              {/* Quick Hero Image/Graphic */}
              <Image 
                  src="/images/heroimage.svg"
                  alt="Study together illustration"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full max-w-md sm:max-w-lg h-auto drop-shfadow-[0_1px_48px_rgba(120,140,255,0.4)]"
                  />
            </div>

            {/* SECTION 2: Right Side - Custom Interactive Area */}
            <SignupForm className="max-w-100 min-w-75 w-[90vw] mb-10 md:mb-0 border border-white/20 mx-6 bg-white/10 backdrop-blur-md shadow-purple-glow"/>

          </div>
        </div>
      </section>
  );
};
