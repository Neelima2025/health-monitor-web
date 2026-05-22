import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../firebaseConfig";
import {
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PatientDashboard() {
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [phc, setPhc] = useState("");
  const [prescription, setPrescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const navigate = useNavigate();

  // ✅ Load existing data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, "patients", auth.currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setSymptoms(data.symptoms || "");
        setPrescription(data.prescription || "");
        setPhc(data.phc || "");
        setUploadedMedia(data.media || []);
      }
    };
    fetchData();
  }, []);

  // ✅ Upload files to Firebase Storage
  const uploadMedia = async (files) => {
    const uploaded = [];
    for (const file of files) {
      const fileRef = ref(storage, `patients/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      uploaded.push({ name: file.name, url });
    }
    return uploaded;
  };

  // ✅ Submit symptoms
  const handleSubmit = async () => {
    if (!name || !symptoms) {
      alert("Please fill all fields.");
      return;
    }

    let mediaURLs = [];
    if (mediaFiles.length > 0) {
      mediaURLs = await uploadMedia(mediaFiles);
    }

    const ref = doc(db, "patients", auth.currentUser.uid);
    await setDoc(ref, {
      uid: auth.currentUser.uid,
      name,
      symptoms,
      phc,
      prescription,
      media: [...uploadedMedia, ...mediaURLs],
      createdAt: serverTimestamp(),
    });

    alert("✅ Symptoms submitted successfully!");
  };

  // ✅ Find nearest PHC
  const handleFindPHC = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );

        const address = res.data.address;
        const phcName =
          address.village || address.town || address.city || "Nearest PHC Center";
        setPhc(phcName);
        alert(`📍 Nearest PHC: ${phcName}`);
      });
    } catch (e) {
      alert("Unable to fetch PHC");
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h2>🏥 Patient Dashboard</h2>

      <button
        onClick={handleLogout}
        style={{
          background: "#d9534f",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: 5,
          cursor: "pointer",
          marginBottom: 15,
        }}
      >
        Logout
      </button>

      <div
        style={{
          background: "#fafafa",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <label><strong>Name:</strong></label><br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <label><strong>Symptoms:</strong></label><br />
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          style={{ width: "100%", padding: 8, height: 80, marginBottom: 10 }}
        />

        <label><strong>Upload Photos/Videos:</strong></label><br />
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => setMediaFiles(Array.from(e.target.files))}
          style={{ marginBottom: 10 }}
        />

        <button
          onClick={handleFindPHC}
          style={{
            background: "#0275d8",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: 5,
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          Find Nearest PHC
        </button>

        <p><strong>Nearest PHC:</strong> {phc || "Not found yet"}</p>

        <button
          onClick={handleSubmit}
          style={{
            background: "#5cb85c",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Submit Symptoms
        </button>
      </div>

      {/* Prescription Section */}
      <div
        style={{
          marginTop: 20,
          background: "#e8f5e9",
          padding: 15,
          borderRadius: 8,
        }}
      >
        <h3>🩺 Doctor's Prescription</h3>
        <p>{prescription || "No prescription yet."}</p>
      </div>

      {/* Uploaded Media Section */}
      {uploadedMedia.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>📸 Uploaded Files</h3>
          {uploadedMedia.map((m, i) => (
            <div key={i}>
              {m.url.includes(".mp4") ? (
                <video width="100%" controls src={m.url}></video>
              ) : (
                <img
                  src={m.url}
                  alt={m.name}
                  style={{ width: "100%", marginBottom: 10 }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* PHC Map Section */}
      <div
        style={{
          marginTop: 30,
          border: "1px solid #ccc",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <iframe
          title="PHC Map"
          src="https://www.openstreetmap.org/export/embed.html"
          style={{ width: "100%", height: 300, border: "none" }}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}





