import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6oUhYMi-ZcLdBPeIPWzXBznhNtt9PJHk",
  authDomain: "apploja-db455.firebaseapp.com",
  databaseURL: "https://apploja-db455-default-rtdb.firebaseio.com",
  projectId: "apploja-db455",
  storageBucket: "apploja-db455.appspot.com",
  messagingSenderId: "1024789330192",
  appId: "1:1024789330192:web:6872184fc69df6181ecd95",
  measurementId: "G-YYEZJV3G81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db =  getDatabase(app);



export {app, db}