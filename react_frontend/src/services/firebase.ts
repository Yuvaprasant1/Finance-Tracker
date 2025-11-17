import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxIMRdkFJQVm0U54vfZtztQ62TxWCG0bk",
  authDomain: "finance-tracker-53c8a.firebaseapp.com",
  projectId: "finance-tracker-53c8a",
  storageBucket: "finance-tracker-53c8a.firebasestorage.app",
  messagingSenderId: "1058479237538",
  appId: "1:1058479237538:web:ace1ebbe05721fe74c2afb",
  measurementId: "G-3MYCLH6EHZ"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);