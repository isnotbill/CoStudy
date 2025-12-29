"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Settings,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { CostudyLogo } from "../layout/Logo";
import { UserCard } from "../dashboard/UserCard";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "My Rooms", icon: LayoutGrid, url: "rooms" },
  { name: "Friends", icon: User, url: "friends" },
  { name: "Settings", icon: Settings, url: "settings" },
];

const userData = {
  username: "costudy_user",
  avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
  badgeLabel: "Student",
  streakDays: 14,
};

type SidebarContentProps = {
  collapsed?: boolean;
  isMobile?: boolean;
  onNavigate?: () => void; // used to close the mobile sheet on link click
};

function SidebarContent({ collapsed = false, isMobile = false, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          "flex items-center transition-all h-24",
          collapsed ? "justify-center px-0" : "justify-center px-8"
        )}
      >
        {!collapsed ? (
          <div className={isMobile ? "scale-90" : ""}>
            <CostudyLogo />
          </div>
        ) : (
          <BookOpen className="text-blue-600 w-8 h-8" strokeWidth={3} />
        )}
      </div>
      <div className="px-4 py-2"> <Link href="/profile"> {!collapsed ? ( <UserCard username={userData.username} avatarUrl={userData.avatarUrl} badgeLabel={userData.badgeLabel} streakDays={userData.streakDays} /> ) : ( <div className="flex justify-center"> <Avatar className="h-10 w-10 border-2 border-slate-900 hover:border-blue-600 transition-colors"> <AvatarImage src={userData.avatarUrl} /> <AvatarFallback>U</AvatarFallback> </Avatar> </div> )} </Link> </div>

      {/* Tabs */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-x-hidden">
        {tabs.map((tab) => {
          const href = `/dashboard/${tab.url}`;
          const isActive = pathname === href;

          return (
            <Button
              key={tab.name}
              asChild
              variant="default"
              className={cn(
                "w-full font-bold h-12 text-base transition-all relative overflow-hidden",
                isActive
                  ? "bg-transparent text-blue-700 border border-blue-300"
                  : "bg-transparent text-slate-600 hover:text-blue-600 hover:bg-blue-50",
                collapsed ? "justify-center px-0" : "justify-start gap-3"
              )}
            >
              <Link href={href} onClick={onNavigate} className="w-full">
                <tab.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{tab.name}</span>}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn("p-6 border-t border-slate-200", collapsed && "px-2 flex justify-center")}>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "w-full gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 font-bold overflow-hidden",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
          onClick={() => {}}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 border-b-2 border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 w-full">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="p-2 rounded-md border text-slate-700 hover:bg-slate-100">
            <Menu className="h-6 w-6" />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="p-0 w-80 bg-[#fdfbf6] border-r-2 border-slate-200"
            onPointerDownCapture={(e) => e.stopPropagation()}
          >
            <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>

            <SidebarContent collapsed={false} isMobile={true} onNavigate={closeMobile} />
          </SheetContent>
        </Sheet>

        <div className="scale-75">
          <CostudyLogo />
        </div>

        <div className="w-10" />
      </div>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 288 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col h-screen sticky top-0 border-r-2 border-slate-200 bg-white/80 backdrop-blur-sm z-50 relative"
      >
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-12 bg-white border-2 border-slate-200 text-slate-500 rounded-full p-1 shadow-sm hover:border-blue-600 hover:text-blue-600 transition-colors z-50"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <SidebarContent collapsed={collapsed} />
      </motion.aside>
    </>
  );
}
