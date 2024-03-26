
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPoeEmOzl6usPubL0z-iLHp_IC9j6uvmU",
  authDomain: "tutog-18970.firebaseapp.com",
  projectId: "tutog-18970",
  storageBucket: "tutog-18970.appspot.com",
  messagingSenderId: "300696021439",
  appId: "1:300696021439:web:0423855b5c7cdbabc2590a",
  measurementId: "G-1F8YS72T18"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
