import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all patient records
  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(data);
    };
    fetchPatients();
  }, []);

  // ✅ Update prescription for selected patient
  const handleSavePrescription = async (id) => {
    if (!prescription.trim()) {
      alert("Please enter a prescription.");
      return;
    }

    const ref = doc(db, "patients", id);
    await updateDoc(ref, {
      prescription,
      lastUpdated: serverTimestamp(),
    });

    alert("✅ Prescription updated successfully!");
    setPrescription("");
  };

  // ✅ Save appointment slot
  const handleSaveAppointment = async (id) => {
    if (!appointmentTime) {
      alert("Please select an appointment time.");
      return;
    }

    const ref = doc(db, "patients", id);
    await updateDoc(ref, {
      appointmentTime,
      lastUpdated: serverTimestamp(),
    });

    alert("📅 Appointment slot saved!");
    setAppointmentTime("");
  };

  // ✅ Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial", maxWidth: 1000, margin: "0 auto" }}>
      {/* Top Navbar */}
      <div
        style={{
          background: "#007bff",
          color: "white",
          padding: "10px 20px",
          borderRadius: 8,
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>🏥 Doctor Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            background: "#dc3545",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Patient List Section */}
      <h3>🧍 All Patients</h3>
      {patients.length === 0 ? (
        <p>No patients available yet.</p>
      ) : (
        <div>
          {patients.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#f8f9fa",
                border: "1px solid #ccc",
                borderRadius: 10,
                padding: 15,
                marginBottom: 20,
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{p.name}</h3>
              <p><strong>Symptoms:</strong> {p.symptoms || "Not provided"}</p>
              <p><strong>PHC:</strong> {p.phc || "N/A"}</p>

              {p.appointmentTime && (
                <p><strong>📅 Appointment:</strong> {new Date(p.appointmentTime).toLocaleString()}</p>
              )}

              {/* Media Files */}
              {p.media && p.media.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <strong>📸 Uploaded Media:</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                    {p.media.map((m, i) =>
                      m.url.includes(".mp4") ? (
                        <video
                          key={i}
                          controls
                          width="200"
                          src={m.url}
                          style={{ borderRadius: 8, border: "1px solid #ccc" }}
                        ></video>
                      ) : (
                        <img
                          key={i}
                          src={m.url}
                          alt={m.name}
                          width="200"
                          style={{ borderRadius: 8, border: "1px solid #ccc" }}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Prescription Input */}
              <div style={{ marginTop: 15 }}>
                <label><strong>💊 Prescription:</strong></label>
                <textarea
                  placeholder="Enter prescription here..."
                  defaultValue={p.prescription || ""}
                  onChange={(e) => setPrescription(e.target.value)}
                  style={{
                    width: "100%",
                    height: 70,
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #aaa",
                    marginTop: 5,
                    resize: "none",
                  }}
                />
                <button
                  onClick={() => handleSavePrescription(p.id)}
                  style={{
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    cursor: "pointer",
                    marginTop: 8,
                  }}
                >
                  Save Prescription
                </button>
              </div>

              {/* Appointment Slot */}
              <div style={{ marginTop: 20 }}>
                <label><strong>🗓️ Set Appointment Slot:</strong></label><br />
                <input
                  type="datetime-local"
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  style={{
                    marginTop: 5,
                    marginRight: 10,
                    padding: 6,
                    borderRadius: 6,
                    border: "1px solid #aaa",
                  }}
                />
                <button
                  onClick={() => handleSaveAppointment(p.id)}
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Save Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

