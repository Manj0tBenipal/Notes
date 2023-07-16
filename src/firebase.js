import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANazK8TJ-stKJbco684kM4YjHX_xitnE4",
  authDomain: "reactnotes-b43e4.firebaseapp.com",
  projectId: "reactnotes-b43e4",
  storageBucket: "reactnotes-b43e4.appspot.com",
  messagingSenderId: "1055167875130",
  appId: "1:1055167875130:web:b45beaa52f03558ed20d03",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");
