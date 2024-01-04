// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRIBASE_API_KEY ,
  authDomain: "griha-3.firebaseapp.com",
  projectId: "griha-3",
  storageBucket: "griha-3.appspot.com",
  messagingSenderId: "404758961108",
  appId: "1:404758961108:web:8a1cdb3d727d1265dc1441"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);