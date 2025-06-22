
import React, { ReactNode } from "react";

interface PopupItem {
    isOpen: boolean,    
    onClose: () => void,
    children: ReactNode
}

export default function Popup({ isOpen, onClose, children }: PopupItem) {
  if (!isOpen) return null; // don’t render if closed

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      />
      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgb(33,31,70)",
          borderRadius: "8px",
          padding: "10px",
          zIndex: 1001,
          width: "400px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <button
          onClick={onClose}
          style={{ float: "right", 
            fontWeight: "bold", 
            cursor: "pointer",
            color: "red",
        
        }}
          aria-label="Close modal"
        >
          x
        </button>
        {children}
      </div>
    </>
  )
}
