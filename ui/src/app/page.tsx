"use client";

import { BackgroundGrid } from "@/components/layout/BackgroundGrid";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";

export default function CoStudyHome() {
  return (
    <BackgroundGrid>
      <Navbar />
      <HeroSection />
    </BackgroundGrid>
  );
}
