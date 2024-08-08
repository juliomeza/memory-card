// scripts/deleteConcepts.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, writeBatch } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyD9D9el_Y-B1avd4OiYc3OF-L4R2Ttoeo0",
    authDomain: "memory-card-944f2.firebaseapp.com",
    projectId: "memory-card-944f2",
    storageBucket: "memory-card-944f2.appspot.com",
    messagingSenderId: "415342274871",
    appId: "1:415342274871:web:694bf31a1cd8501e2a92b2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteConcepts() {
  const conceptsRef = collection(db, 'concepts');
  const snapshot = await getDocs(conceptsRef);
  
  const batch = writeBatch(db);
  
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  try {
    await batch.commit();
    console.log('Todos los conceptos han sido eliminados exitosamente.');
  } catch (error) {
    console.error('Error al eliminar los conceptos:', error);
  }
}

deleteConcepts();