"use client";

import { useState } from "react";

import MainHeader from "@/components/MainHeader";

export default function Room() {
    const [selectedOption, setSelectedOption] = useState("");

    const options = [""]

    return (
        <>
        <main className='bg-[rgb(53,46,78)] w-screen h-screen flex flex-col items-center'>
            <MainHeader/>
            <div className="w-full h-full flex justify-center items-center">
                <div>

                </div>
                <div>

                </div>
            </div>
            
            
        </main>
        </>
    );
}
