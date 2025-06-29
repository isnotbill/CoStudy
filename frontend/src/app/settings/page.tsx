"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import AccountSettings from "@/components/AccountSettings";
import PublicProfile from "@/components/PublicProfile";
import MainHeader from "@/components/MainHeader";
import apiClient from "../../../lib/apiClient";
import Popup from "@/components/Popup";

export default function AccountPage()
{

  const router = useRouter()

  const [activeTab, setActiveTab] = useState("profile");

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // Logout handler
  async function handleLogout(){
    setLogoutLoading(true)
    setError(null)

    try {
      await apiClient.post("/logout")
      router.replace('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLogoutLoading(false)
    }
  }

  // Delete account handler
  async function handleDelete(){
    setError(null)
    setDeleteLoading(true)

    try {
      await apiClient.delete("/delete/account")
      await apiClient.post("/logout")
      router.replace('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDeleteLoading(false)
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
            hover:text-[#d6d6d6] mt-[130px] mb-2`}
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}>
              Logout
            </button>

            <button className={`w-full  py-3 rounded-2xl font-semibold text-red-600
            hover:text-[#be3535]`}
            type="button"
            onClick={() => setShowPopUp(true)}
            disabled={deleteLoading}>
              Delete Account
            </button>

            {error && <p className="text-red-500 text-[12px]">{error}</p>}
              <Popup 
              isOpen={showPopUp}
              onClose={() => setShowPopUp(false)}
              >
              <h1 className="text-white m-3 mt-8 text-center">Are you sure you want to delete your account?</h1>
              <div className="text-red-500 m-3 text-center">WARNING: This action is irreversible. All rooms in which you are an admin will be deleted.</div>  
              <button className="popup-button w-full h-[45px] mt-5"
              onClick={() => {
                  if(showPopUp == false) return
                  handleDelete()
                  setShowPopUp(false);
              }}>
              
                  Confirm
              </button>
              </Popup>  

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