// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA4gA520vxrl3gqgEtfrKge9fMafc7Re7g",
    authDomain: "assignment-cd0b3.firebaseapp.com",
    projectId: "assignment-cd0b3",
    storageBucket: "assignment-cd0b3.appspot.com",
    messagingSenderId: "62781853992",
    appId: "1:62781853992:web:a2ccca285463f84da3401d"
};

// Initialize Firebase
export const initDB = initializeApp(firebaseConfig);
