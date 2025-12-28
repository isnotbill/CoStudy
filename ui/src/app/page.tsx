"use client";

import { BackgroundGrid } from "@/components/layout/BackgroundGrid";
import { Navbar } from "@/components/root/Navbar";
import { HeroSection } from "@/components/root/HeroSection";

export default function CoStudyHome() {
  return (
    <BackgroundGrid>
      <Navbar />
      <HeroSection />
    </BackgroundGrid>
  );
}
