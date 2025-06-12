"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import AccountSettings from "@/components/AccountSettings";
import PublicProfile from "@/components/PublicProfile";
import MainHeader from "@/components/MainHeader";
import axios from "axios"


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
      const res = await axios.post(
        'http://localhost:8080/logout',
        {},
        { withCredentials: true},
      )
      // router.push('/login')
    } catch (err: any) {
      setLogoutError(err.message)
    } finally {
      setLogoutLoading(false)
    }
  }
  return(
    <>
      
      <div className="bg-[rgb(53,46,78)] h-screen flex flex-col items-center select-none">
        <MainHeader />
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex flex-col items-center bg-[rgb(70,60,102)]
          h-[550] w-[300] px-10 text-white">

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

            <button className={`w-full  py-3 rounded-2xl font-semibold
            hover:text-[#d6d6d6] mt-[170px]`}
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}>
              Logout
            </button>

            {logoutError && <p className="text-red-500 text-[12px]">{logoutError}</p>}


          </div>
          <div className="flex flex-col justify-center items-center bg-gray-200 h-[550]
          w-[620] gap-12 px-10">

            {activeTab === "profile" && <PublicProfile />}
            {activeTab === "account" && <AccountSettings />}

          </div>
        </div>


      </div>
    </>
  )
}