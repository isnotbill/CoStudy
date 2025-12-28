import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BackgroundGrid } from "@/components/layout/BackgroundGrid"; // Using your component
import { LoginForm } from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <BackgroundGrid showFloatingSupplies={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <LoginForm />
      </div>
    </BackgroundGrid>
  );
}