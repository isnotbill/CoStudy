"use client";

import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowRight, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { CostudyLogo } from "@/components/layout/Logo";
import axios from "axios";
import { useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";

// Form Schema
const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginErrors, setLoginErrors] = useState<string[]>([])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    form.clearErrors();

    try {
      const res = await axios.post("/login", values)

      console.log("Login successful:", res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          const body = err.response.data as ApiResponse<string[]>

          if (Array.isArray(body.data)) setLoginErrors(body.data ?? [])
          else setLoginErrors([body.message ?? "Unexpected Error"])
        } else {
          setLoginErrors([err.message])
        }       
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center max-w-md bg-white border-2 border-slate-900 rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)] relative">
      <CostudyLogo />
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Enter your details to start studying</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Username or Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="me@example.com" 
                    className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 font-medium"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-slate-700">Password</FormLabel>
                  {/* <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
                    Forgot?
                  </Link> */}
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 font-medium"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-all">
            {isSubmitting ? <Loader className="animate-spin mr-2 w-4 h-4" /> : <>Sign In <ArrowRight className="ml-2 w-4 h-4" /></> }
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-wider">Or</span></div>
      </div>

      <GoogleAuthButton />

      <div className="mt-6 text-center text-sm font-medium text-slate-600">
        New here? <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-bold">Create an account</Link>
      </div>
    </div>
  );
}