// src/services/

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9D9el_Y-B1avd4OiYc3OF-L4R2Ttoeo0",
  authDomain: "memory-card-944f2.firebaseapp.com",
  projectId: "memory-card-944f2",
  storageBucket: "memory-card-944f2.appspot.com",
  messagingSenderId: "415342274871",
  appId: "1:415342274871:web:694bf31a1cd8501e2a92b2",
  measurementId: "G-KBMB7QN82S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export { auth, db };