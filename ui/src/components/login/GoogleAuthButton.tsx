"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function GoogleAuthButton() {
  const handleGoogleLogin = () => {
    // Add your NextAuth/Clerk logic here
    console.log("Google login clicked");
  };

  return (
    <Button 
      variant="default" 
      onClick={handleGoogleLogin}
      className="w-full h-12 text-base bg-white text-slate-700 font-bold rounded-lg border border-slate-300 transition-all"
    >
      <FcGoogle size={20} />
      <span>Sign in with Google</span>
    </Button>
  );
}