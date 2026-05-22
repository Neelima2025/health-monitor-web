import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        email,
        role,
      });
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert("Signup error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "auto", fontFamily: "Arial" }}>
      <h2>🩺 Sign Up</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ccc" }}
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ccc" }}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginBottom: 10 }}
      >
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>

      <button
        onClick={handleSignup}
        style={{
          width: "100%",
          padding: 10,
          border: "none",
          background: "#007bff",
          color: "white",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Create Account
      </button>

      <p style={{ marginTop: 15 }}>
        Already have an account?{" "}
        <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
}


