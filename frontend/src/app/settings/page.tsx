"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountSettings from "@/components/AccountSettings";
import PublicProfile from "@/components/PublicProfile";
import MainHeader from "@/components/MainHeader";
import apiClient from "../../../lib/apiClient";
import axios from "axios";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  image: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [profile, setProfile] = useState<UserProfile>();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await apiClient.get("/user");
        setProfile(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)){
          setErrorMsg(err.message || "Failed to fetch user profile");
        }
      }
    }
    fetchProfile();
  }, []);

  async function handleLogout() {
    setLogoutLoading(true);
    setLogoutError(null);
    try {
      await apiClient.post("/logout");
      router.replace("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setLogoutError(err.message);
      } 
    } finally {
      setLogoutLoading(false);
    }
  }

  return (
    <>
      <header>
        <title>Settings - CoStudy</title>
      </header>

      <div className="min-h-screen bg-gradient-to-br from-[#7464ae] via-[#644fb1] to-[#5c4d94] text-white">
        <MainHeader />

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Top Tabs */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>

          <div className="flex space-x-4 mb-8 border-b border-gray-300 pb-2">
            <button
              className={`px-4 py-2 text-lg font-medium rounded-t-md transition
                ${
                  activeTab === "profile"
                    ? "text-gray-200 border-b-2 border-gray-200"
                    : "text-gray-200 hover:text-indigo-300"
                }`}
              onClick={() => setActiveTab("profile")}
            >
              Public Profile
            </button>
            <button
              className={`px-4 py-2 text-lg font-medium rounded-t-md transition
                ${
                  activeTab === "account"
                    ? "text-gray-200 border-b-2 border-gray-200"
                    : "text-gray-200 hover:text-indigo-300"
                }`}
              onClick={() => setActiveTab("account")}
            >
              Account Settings
            </button>
          </div>

          {/* Content Container */}
          <div className="bg-white rounded-xl shadow-xl p-8 backdrop-blur-lg bg-opacity-85 border border-gray-200">
            {activeTab === "profile" && profile?.id && (
              <PublicProfile user={{ id: profile.id, image: profile.image }} />
            )}
            {activeTab === "account" && profile?.id && (
              <AccountSettings
                user={{
                  id: profile.id,
                  username: profile.username,
                  email: profile.email,
                }}
              />
            )}
            {!profile?.id && (
              <p className="text-gray-500 text-center">Loading profile...</p>
            )}
            {errorMsg && (
              <p className="text-red-500 text-center mt-4">{errorMsg}</p>
            )}
            {logoutError && (
              <p className="text-red-500 text-center mt-2">{logoutError}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
