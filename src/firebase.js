import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUXn4zd1HyjzLCyWIRJ5911Uq4Xo5HUIQ",
  authDomain: "electionportal-39736.firebaseapp.com",
  projectId: "electionportal-39736",
  storageBucket: "electionportal-39736.firebasestorage.app",
  messagingSenderId: "360495883558",
  appId: "1:360495883558:web:a2cf19c527323ccd368de7",
  measurementId: "G-95RG3VTL8B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
