// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSv9tPnnl9Dk9B-vxPliq3A22BCBchOjc",
  authDomain: "sellerspointt.firebaseapp.com",
  projectId: "sellerspointt",
  storageBucket: "sellerspointt.firebasestorage.app",
  messagingSenderId: "321795876195",
  appId: "1:321795876195:web:20e04499d8ac3c46229f56",
  measurementId: "G-0CL3BM01ZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);