
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVB_Wx3yTmCkjX289K7p55zQe6JtXwqbM",
  authDomain: "hyupcamp-auction.firebaseapp.com",
  projectId: "hyupcamp-auction",
  storageBucket: "hyupcamp-auction.firebasestorage.app",
  messagingSenderId: "715272776933",
  appId: "1:715272776933:web:fb7672b57be20ba520380c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
