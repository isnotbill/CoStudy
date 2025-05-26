"use client";

import { useState } from "react";
import AccountSettings from "@/components/AccountSettings";
import PublicProfile from "@/components/PublicProfile";
import MainHeader from "@/components/MainHeader";


export default function AccountPage()
{

  const [activeTab, setActiveTab] = useState("profile");

  return(
    <>
      
      <div className="bg-[rgb(53,46,78)] h-screen flex flex-col items-center">
        <MainHeader />
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex flex-col items-center bg-[rgb(70,60,102)]
          h-[600] w-[300] px-10 text-white">

          <label className="font-cedarville text-[45px] my-[60px]">Settings</label>

          <button className={`w-full  py-3 rounded-2xl font-semibold
          hover:text-[#d6d6d6] hover:underline
            ${activeTab === "profile"
              ? "bg-[rgb(95,81,138)]"
              : ""
            }`}
           onClick={() => setActiveTab("profile")}>
            Public Profile
          </button>

          <button className={`w-full  py-3 rounded-2xl font-semibold
           hover:text-[#d6d6d6] hover:underline
            ${activeTab === "account"
              ? "bg-[rgb(95,81,138)]"
              : ""
           }`}
          onClick={() => setActiveTab("account")}>
            Account Settings
          </button>

          </div>
          <div className="flex flex-col justify-center items-center bg-gray-100 h-[600]
          w-[700] gap-12 px-10">

            {activeTab === "profile" && <PublicProfile />}
            {activeTab === "account" && <AccountSettings />}

          </div>
        </div>


      </div>
    </>
  )
}