"use client";

import React from "react";
import { DashboardLayout } from "@/app/dashboard/components/DashLayout";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="gap-8w-full">
        {children}
      </div>
    </DashboardLayout>
  );
}