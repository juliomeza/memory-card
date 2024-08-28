import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Configuración global para las pruebas
jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');