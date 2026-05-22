import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Health Monitor</h2>
      <div>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/signup" style={styles.link}>Signup</Link>
        <Link to="/doctor" style={styles.link}>Doctor</Link>
        <Link to="/patient" style={styles.link}>Patient</Link>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0078D4",
    padding: "12px 40px",
    color: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  logo: { margin: 0, fontSize: 22, fontWeight: "600" },
  link: {
    color: "white",
    marginRight: 20,
    textDecoration: "none",
    fontWeight: "500"
  },
  logout: {
    background: "#d9534f",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer"
  }
};
