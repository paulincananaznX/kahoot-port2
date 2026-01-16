import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAyC0wDDFW81Ldqq7F07OlygB1V1mSNCKI",
    authDomain: "kahoot-67bc4.firebaseapp.com",
    databaseURL: "https://kahoot-67bc4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kahoot-67bc4",
    storageBucket: "kahoot-67bc4.firebasestorage.app",
    messagingSenderId: "47313021693",
    appId: "1:47313021693:web:34e1c5f1f2ba3ac066ac94",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const firestore = getFirestore(app);

export { app, db, firestore };
