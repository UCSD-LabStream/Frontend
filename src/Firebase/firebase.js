// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASShDYE5_R8QYbt5c1uIu5uPTH658pU3E",
  authDomain: "labstream-web.firebaseapp.com",
  projectId: "labstream-web",
  storageBucket: "labstream-web.firebasestorage.app",
  messagingSenderId: "1046212682096",
  appId: "1:1046212682096:web:9a29e1ca04d6c7fdda6fb5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const labSlots = getFirestore(app);

export { app, auth, labSlots };