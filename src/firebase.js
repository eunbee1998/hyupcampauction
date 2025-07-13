
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "apiKey": "YOUR_API_KEY",
  "authDomain": "hyupcamp-auction.firebaseapp.com",
  "projectId": "hyupcamp-auction",
  "storageBucket": "hyupcamp-auction.appspot.com",
  "messagingSenderId": "YOUR_SENDER_ID",
  "appId": "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
