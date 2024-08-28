const firebaseMock = jest.genMockFromModule('firebase/app');

firebaseMock.initializeApp = jest.fn(() => ({
  container: {
    // Añade aquí cualquier propiedad que pueda ser necesaria
  }
}));

module.exports = firebaseMock;