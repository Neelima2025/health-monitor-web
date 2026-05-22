import React from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div style={{
        textAlign: "center",
        marginTop: 100,
        fontFamily: "Arial"
      }}>
        <h1>Welcome to Health Monitor System 🩺</h1>
        <p style={{ fontSize: 18, marginTop: 10 }}>
          Connect patients and doctors for faster and smarter health management.
        </p>
      </div>
    </div>
  );
}
