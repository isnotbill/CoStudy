"use client";

import { useState } from "react";

import MainHeader from "@/components/MainHeader";

export default function Room() {

    return (
        <>
        <main className='bg-[rgb(53,46,78)] w-screen h-screen flex flex-col items-center'>
            <MainHeader/>
            <div className="w-[100vw] w-min-[1000px] h-full flex justify-center items-start flex-wrap gap-8 my-8">
                <div className="flex flex-col gap-8 w-[500px] w-min-[100vw] h-full">
                    <div className="w-[500px] w-min-[100vw] h-[500px] rounded-md p-8 border-2">
                        <div className="w-full h-[50%] rounded-md flex justify-center items-center">
                            <h1 className="text-[rgb(255,255,255)] text-[150px] font-mono">25:00</h1>
                        </div>
                    </div>
                    <div className="overflow-auto rounded-md p-8 border-2 flex flex-grow items-start flex-col gap-2 over">
                        <div className="flex justify-start items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white">

                            </div>
                            <h1 className="text-white">Username</h1>
                        </div>
                        <div className="flex justify-start items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white">

                            </div>
                            <h1 className="text-white">Username</h1>
                        </div>
                    </div>
                </div>
                
                <div className=" w-[500] w-min-[100vw] h-[800px] overflow-auto rounded-md border-2 px-2 py-8 flex flex-col gap-4">
                    <div className="flex justify-start items-end gap-2">
                        <div className="w-8 h-8 rounded-full bg-white">

                        </div>
                        <div className="bg-[rgba(255,255,255,0.7)] rounded-3xl p-2 inline-block break-words max-w-xs">
                            yo wanna costudy yo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudy
                        </div>
                    </div>

                    <div className="flex justify-end items-end gap-2">
                        <div className="bg-[rgba(206,133,255,0.7)] rounded-3xl p-2 flex justify-end inline-block max-w-xs">
                            yo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudy
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white">

                        </div>
                    </div>

                    <div className="flex justify-end items-end gap-2">
                        <div className="bg-[rgba(206,133,255,0.7)] rounded-3xl p-2 flex justify-end inline-block max-w-xs">
                            yo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudy
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white">

                        </div>
                    </div>

                    <div className="flex justify-end items-end gap-2">
                        <div className="bg-[rgba(206,133,255,0.7)] rounded-3xl p-2 flex justify-end inline-block max-w-xs">
                            yo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudy
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white">

                        </div>
                    </div>

                    <div className="flex justify-end items-end gap-2">
                        <div className="bg-[rgba(206,133,255,0.7)] rounded-3xl p-2 flex justify-end inline-block max-w-xs">
                            yo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudyyo wanna costudy
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white">

                        </div>
                    </div>
                </div>
            </div>
            
            
        </main>
        </>
    );
}
