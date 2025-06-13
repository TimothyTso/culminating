import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADQbWPnjzilShwlc3CMhJbFz2X5KFwFyA",
  authDomain: "ics4u-a5f3c.firebaseapp.com",
  projectId: "ics4u-a5f3c",
  storageBucket: "ics4u-a5f3c.firebasestorage.app",
  messagingSenderId: "274919655026",
  appId: "1:274919655026:web:9c283b947e3eba44ff64eb",
  measurementId: "G-VMJKRYFPXT"
};
const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };
