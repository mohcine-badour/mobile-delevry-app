// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove , onValue} from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNO-Hd-jNcHl-w5Lw8YwHZmiZ_kSxVqAU",
  authDomain: "bmd-mobile-app-a6eda.firebaseapp.com",
  databaseURL: "https://bmd-mobile-app-a6eda-default-rtdb.firebaseio.com",
  projectId: "bmd-mobile-app-a6eda",
  storageBucket: "bmd-mobile-app-a6eda.firebasestorage.app",
  messagingSenderId: "678717413178",
  appId: "1:678717413178:web:954677bea8a67c688fe203",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, get, update, remove, onValue };
