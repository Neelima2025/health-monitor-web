// Import the necessary Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCqbRll24WUbKiK0_4_-Wc4RWqBkUYiag",
  authDomain: "health-monitor-web.firebaseapp.com",
  projectId: "health-monitor-web",
  storageBucket: "health-monitor-web.appspot.com",
  messagingSenderId: "743117843801",
  appId: "1:743117843801:web:5887edf33372d41861f048",
  measurementId: "G-ECGQB0SW54",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Export all initialized services once
export { auth, db, storage };
                                  

                                                                                                                                                                                                                                                                                                       
                                       