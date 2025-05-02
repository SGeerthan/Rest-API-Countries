// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLmqDInmwVm1OhDosqDMH2AljxMhUZ-xs",
  authDomain: "afassignment02.firebaseapp.com",
  projectId: "afassignment02",
  storageBucket: "afassignment02.firebasestorage.app",
  messagingSenderId: "947948842609",
  appId: "1:947948842609:web:565377c473a55e0c73b5d0",
  measurementId: "G-D3GW33QDM7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db=getFirestore(app);

export {app,auth,db};
// const analytics = getAnalytics(app);