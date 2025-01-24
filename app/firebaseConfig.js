// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBKW-K3I3zjEUAstOld7IyJtKRZyQ94QI8",
    authDomain: "passmanager-65055.firebaseapp.com",
    projectId: "passmanager-65055",
    storageBucket: "passmanager-65055.firebasestorage.app",
    messagingSenderId: "1085935134355",
    appId: "1:1085935134355:web:2df73186330cee19224f66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export { auth };