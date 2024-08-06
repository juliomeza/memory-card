import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || (process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).react.app.firebase_api_key),
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || (process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).react.app.firebase_auth_domain),
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || (process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).react.app.firebase_project_id),
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || (process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).react.app.firebase_storage_bucket),
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || (process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).react.app.firebase_messaging_sender_id),
  appId: process.env.REACT_APP_FIREBASE_APP_ID || (process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).react.app.firebase_app_id)
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export { auth, db };