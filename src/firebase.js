// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANazK8TJ-stKJbco684kM4YjHX_xitnE4",
  authDomain: "reactnotes-b43e4.firebaseapp.com",
  projectId: "reactnotes-b43e4",
  storageBucket: "reactnotes-b43e4.appspot.com",
  messagingSenderId: "1055167875130",
  appId: "1:1055167875130:web:b45beaa52f03558ed20d03",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");
