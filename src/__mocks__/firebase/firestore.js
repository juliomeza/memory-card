module.exports = {
    initializeFirestore: jest.fn(() => ({
      // Añade aquí cualquier propiedad que pueda ser necesaria para simular Firestore
    })),
    persistentLocalCache: jest.fn(),
    persistentMultipleTabManager: jest.fn(),
  };