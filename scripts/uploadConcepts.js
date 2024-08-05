// scripts/uploadConcepts.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD9D9el_Y-B1avd4OiYc3OF-L4R2Ttoeo0",
    authDomain: "memory-card-944f2.firebaseapp.com",
    projectId: "memory-card-944f2",
    storageBucket: "memory-card-944f2.appspot.com",
    messagingSenderId: "415342274871",
    appId: "1:415342274871:web:694bf31a1cd8501e2a92b2"

};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lee el archivo JSON
const conceptsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'concepts.json'), 'utf8'));

async function uploadConcepts() {
  const batch = writeBatch(db);
  const conceptsRef = collection(db, 'concepts');

  conceptsData.concepts.forEach((concept) => {
    const docRef = doc(conceptsRef);
    batch.set(docRef, concept);
  });

  try {
    await batch.commit();
    console.log('Conceptos subidos exitosamente a Firestore');
  } catch (error) {
    console.error('Error al subir conceptos:', error);
  }
}

uploadConcepts();