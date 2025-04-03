import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBwKVc3UJWslUgNxi0iBvedm2lAaogrInQ",
    authDomain: "mess-3ac72.firebaseapp.com",
    projectId: "mess-3ac72",
    storageBucket: "mess-3ac72.firebasestorage.app",
    messagingSenderId: "341104297772",
    appId: "1:341104297772:web:e9c491f36eec0e6f714e89",
    measurementId: "G-R71EMLK758"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
