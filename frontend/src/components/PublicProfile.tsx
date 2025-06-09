"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";

export default function PublicProfile() {
  const [username, setUsername] = useState("john_doe");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(username);

  const handleUpload = () => {
    alert("Upload new avatar…");
  };

  const handleDefault = () => {
    alert("Reset to default icon…");
  };

  const saveUsername = () => {
    setUsername(draft);
    setEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Avatar + actions */}
      <div className="flex items-center space-x-6">
        {/* circle container */}
        <div className="relative w-[250] h-[250] rounded-full border-4 border-white overflow-hidden">
          <Image
            src="/images/loginblob.png"
            alt="Profile avatar"
            fill
            className="object-cover"
          />
        </div>

        {/* buttons */}
        <div className="space-y-2">
          <button
            onClick={handleUpload}
            className="block w-full px-4 py-2 bg-[rgb(106,91,155)] text-white rounded-lg hover:bg-[rgb(70,60,102)]"
          >
            Upload New
          </button>
          <button
            onClick={handleDefault}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Change Default Icon
          </button>
        </div>
      </div>

    </div>
  );
}