"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import AccountSettings from "@/components/AccountSettings";
import PublicProfile from "@/components/PublicProfile";
import MainHeader from "@/components/MainHeader";
import apiClient from "../../../lib/apiClient";


export default function AccountPage()
{

  const router = useRouter()

  const [activeTab, setActiveTab] = useState("profile");

  const [logoutLoading, setLogoutLoading] = useState(false);

  const [logoutError, setLogoutError] = useState<string | null>(null)

  async function handleLogout(){
    setLogoutLoading(true)
    setLogoutError(null)

    try {
      await apiClient.post("/logout")
      router.replace('/login')
    } catch (err: any) {
      setLogoutError(err.message)
    } finally {
      setLogoutLoading(false)
    }
  }
  return(
    <>
      <header>
        <title>Settings - CoStudy</title>
      </header>

      <div className="bg-[rgb(33,31,48)] h-screen flex flex-col items-center select-none">
        <MainHeader />
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex flex-col items-center bg-[#3b3755]
          h-[550] w-[300] px-10 text-white">

            <label className="font-cedarville text-[45px] my-[60px]">Settings</label>

            <button className={`w-full  py-3 rounded-2xl font-semibold
            hover:text-[#d6d6d6] hover:underline
              ${activeTab === "profile"
                ? "bg-[rgb(46,43,68)]"
                : ""
              }`}
            onClick={() => setActiveTab("profile")}>
              Public Profile
            </button>

            <button className={`w-full  py-3 rounded-2xl font-semibold
            hover:text-[#d6d6d6] hover:underline
              ${activeTab === "account"
                ? "bg-[rgb(46,43,68)]"
                : ""
            }`}
            onClick={() => setActiveTab("account")}>
              Account Settings
            </button>

            <button className={`w-full  py-3 rounded-2xl font-semibold
            hover:text-[#d6d6d6] mt-[170px]`}
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}>
              Logout
            </button>

            {logoutError && <p className="text-red-500 text-[12px]">{logoutError}</p>}


          </div>
          <div className="flex flex-col justify-center items-center bg-[rgb(198,197,199)] h-[550]
          w-[620] gap-12 px-10">

            {activeTab === "profile" && <PublicProfile />}
            {activeTab === "account" && <AccountSettings />}

          </div>
        </div>


      </div>
    </>
  )
}