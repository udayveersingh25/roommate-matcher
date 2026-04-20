// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhuCNZ8YluEc-ZOIfJi8ovUreKEU2ZWkI",
  authDomain: "roommate-matcher-1ad1f.firebaseapp.com",
  projectId: "roommate-matcher-1ad1f",
  storageBucket: "roommate-matcher-1ad1f.firebasestorage.app",
  messagingSenderId: "23733355929",
  appId: "1:23733355929:web:337bc9d9e6cac526377f08",
  measurementId: "G-Z63GZ7GP2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);