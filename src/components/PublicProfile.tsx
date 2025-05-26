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
        <div className="relative w-[300] h-[300] rounded-full border-4 border-white overflow-hidden">
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

      {/* Username section */}
      <div className="flex items-center justify-center space-x-4">
        <label className="font-medium whitespace-nowrap">Username:</label>
        {editing ? (
          <>
            <input
              type="text"
              value={draft}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDraft(e.target.value)
              }
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            />
            <button
              onClick={saveUsername}
              className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => {
                setDraft(username);
                setEditing(false);
              }}
              className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="font-semibold">{username}</span>
            <button
              onClick={() => setEditing(true)}
              className="text-purple-600 hover:underline"
            >
              Change
            </button>
          </>
        )}
      </div>
    </div>
  );
}
