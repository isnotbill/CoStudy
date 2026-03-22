"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RoomCard } from "@/components/layout/Card"; // Adjust this import path to where RoomCard is
import { cn } from "@/lib/utils";
import { Clock, Lock, Globe, X } from "lucide-react";

// --- Types & Presets ---
interface SettingsDto {
  name: string;
  publicRoom: boolean;
  studyTimeMs: number;
  shortBreakTimeMs: number;
  longBreakTimeMs: number;
  cyclesTillLongBreak: number;
}

const presetSettings: Record<string, SettingsDto> = {
  "pomodoroClassic": { name: "", publicRoom: false, studyTimeMs: 25, shortBreakTimeMs: 5, longBreakTimeMs: 15, cyclesTillLongBreak: 4 },
  "52/17": { name: "", publicRoom: false, studyTimeMs: 52, shortBreakTimeMs: 17, longBreakTimeMs: 30, cyclesTillLongBreak: 4 },
  "Ultradian": { name: "", publicRoom: false, studyTimeMs: 90, shortBreakTimeMs: 20, longBreakTimeMs: 60, cyclesTillLongBreak: 3 },
};

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  username: string;
}

export function CreateRoomModal({ isOpen, onClose, username }: CreateRoomModalProps) {
  const router = useRouter();
  
  const [activePreset, setActivePreset] = useState<string>("pomodoroClassic");
  const [formData, setFormData] = useState<SettingsDto>(presetSettings["pomodoroClassic"]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && username && !formData.name) {
      setFormData(prev => ({ ...prev, name: `${username}'s Room` }));
    }
  }, [isOpen, username, formData.name]);

  const handlePresetChange = (value: string) => {
    setActivePreset(value);
    if (value !== "custom") {
      setFormData(prev => ({
        ...presetSettings[value],
        name: prev.name,
        publicRoom: prev.publicRoom
      }));
    }
  };

  const handleInputChange = (field: keyof SettingsDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field !== 'name' && field !== 'publicRoom') setActivePreset("custom");
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const res = await apiClient.post(`/room/create`, formData);
      onClose(false);
      router.push(`/room/${res.data.data}`);
    } catch (err: any) {
      // Error handling logic same as before...
      const errorData = err?.response?.data;
      if (err.response?.status === 400) setErrors(errorData?.data || { general: "Invalid input" });
      else if (err.response?.status === 409) setErrors({ name: errorData?.message || "Room name conflict" });
      else setErrors({ general: errorData?.message || "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none sm:max-w-[500px] [&>button]:hidden">
        
        <RoomCard className="w-full p-0 flex flex-col overflow-hidden bg-white">
          
          {/* Header */}
          <div className="flex justify-between items-start p-6 bg-slate-50 border-b-2 border-slate-100">
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl font-black text-slate-900">Create Room</DialogTitle>
            </DialogHeader>
            <button onClick={() => onClose(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Room Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-bold">Room Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={cn("font-medium border-2 focus-visible:ring-blue-600", errors.name && "border-red-500")}
              />
              {errors.name && <p className="text-xs font-bold text-red-500">{errors.name}</p>}
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Strategy</Label>
              <Tabs value={activePreset} onValueChange={handlePresetChange} className="w-full">
                <TabsList className="w-full grid grid-cols-4 bg-slate-100 p-1 border border-slate-200">
                  {['pomodoroClassic', '52/17', 'Ultradian', 'custom'].map(t => (
                    <TabsTrigger key={t} value={t} className="text-[10px] sm:text-xs font-bold uppercase">
                      {t === 'pomodoroClassic' ? 'Pomodoro' : t}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Timers Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Focus (min)', field: 'studyTimeMs' },
                { label: 'Short Break', field: 'shortBreakTimeMs' },
                { label: 'Cycles', field: 'cyclesTillLongBreak' },
                { label: 'Long Break', field: 'longBreakTimeMs' },
              ].map((item) => (
                <div key={item.field} className="space-y-1">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</Label>
                  <div className="relative">
                    {/* Add Clock icon only for time fields if desired, simplified here */}
                    <Input 
                      type="number" 
                      className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 font-mono text-sm"
                      // @ts-ignore
                      value={formData[item.field]}
                      // @ts-ignore
                      onChange={(e) => handleInputChange(item.field, parseInt(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Privacy */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Privacy</Label>
              <RadioGroup 
                value={formData.publicRoom ? "public" : "private"}
                onValueChange={(val) => handleInputChange("publicRoom", val === "public")}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { val: 'private', icon: Lock, label: 'Private' },
                  { val: 'public', icon: Globe, label: 'Public' }
                ].map((opt) => (
                  <div key={opt.val}>
                    <RadioGroupItem value={opt.val} id={opt.val} className="peer sr-only" />
                    <Label
                      htmlFor={opt.val}
                      className={`
                        flex flex-row items-center justify-center gap-2 
                        rounded-lg border-2 border-slate-200 bg-transparent 
                        p-2.5 hover:bg-slate-50 
                        peer-data-[state=checked]:border-blue-600 
                        peer-data-[state=checked]:text-blue-600 
                        peer-data-[state=checked]:bg-blue-50
                        cursor-pointer transition-all
                      `}
                    >
                      <opt.icon className="h-4 w-4" />
                      <span className="font-bold text-xs uppercase tracking-wide">{opt.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {errors.general && <p className="text-sm font-bold text-red-500 text-center">{errors.general}</p>}
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 border-t-2 border-slate-100 flex justify-end gap-3">
             <Button variant="ghost" onClick={() => onClose(false)} className="font-bold text-slate-500 hover:text-slate-700">
               Cancel
             </Button>
             <Button 
               onClick={handleSubmit} 
               disabled={isLoading}
               className="font-bold bg-slate-900 text-white hover:bg-blue-600 shadow-sm"
             >
               {isLoading ? "Creating..." : "Create Room"}
             </Button>
          </div>

        </RoomCard>
      </DialogContent>
    </Dialog>
  );
}
