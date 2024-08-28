const firebaseMock = jest.genMockFromModule('firebase/app');
firebaseMock.initializeApp = jest.fn();
module.exports = firebaseMock;