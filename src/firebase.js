// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, //como o VITE importa coisas do .env
  authDomain: "mern-gymbro-auth.firebaseapp.com",
  projectId: "mern-gymbro-auth",
  storageBucket: "mern-gymbro-auth.appspot.com",
  messagingSenderId: "604741867467",
  appId: "1:604741867467:web:0eeeb8160f21474810c84e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);