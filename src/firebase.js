// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9D9el_Y-B1avd4OiYc3OF-L4R2Ttoeo0",
  authDomain: "memory-card-944f2.firebaseapp.com",
  projectId: "memory-card-944f2",
  storageBucket: "memory-card-944f2.appspot.com",
  messagingSenderId: "415342274871",
  appId: "1:415342274871:web:694bf31a1cd8501e2a92b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };