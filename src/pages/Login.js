import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCred.user.uid));

      if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        if (userRole === role) {
          if (role === "doctor") navigate("/doctor");
          else navigate("/patient");
        } else {
          alert(`This account is registered as a ${userRole}.`);
        }
      } else {
        alert("User record not found.");
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Please enter your email to reset password.");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Check your inbox.");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "auto", fontFamily: "Arial" }}>
      <h2>🔐 Login</h2>

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
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: 10,
          border: "none",
          background: "#28a745",
          color: "white",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Login
      </button>

      <p
        onClick={() => setShowForgot(!showForgot)}
        style={{ color: "#007bff", cursor: "pointer", marginTop: 10 }}
      >
        Forgot Password?
      </p>

      {showForgot && (
        <div style={{ marginTop: 10 }}>
          <button
            onClick={handleForgotPassword}
            style={{
              width: "100%",
              padding: 8,
              border: "none",
              background: "#ffc107",
              color: "black",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Send Reset Email
          </button>
        </div>
      )}

      <p style={{ marginTop: 15 }}>
        Don’t have an account?{" "}
        <span
          style={{ color: "#007bff", cursor: "pointer" }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}

