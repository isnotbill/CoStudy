"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SignupForm } from "./signup-form";

export const Hero = () => {
  return (
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-glow-mesh pt-20 bg-gradient-to-br from-[#7464ae] via-[#644fb1] to-[#5c4d94]">
        <div className="absolute inset-0 z-0">

        </div>

        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center gap-16">
            
            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <span style={{ fontFamily: 'var(--font-cedarville)'}} className="text-left text-primary italic font-display font-extralight text-6xl">Study Together, Stress-Free</span>
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
                  className="w-full max-w-md sm:max-w-lg h-auto"
                  />
            </div>

            {/* SECTION 2: Right Side - Custom Interactive Area */}
            <SignupForm className="w-100 border"/>

          </div>
        </div>
      </section>
  );
};
