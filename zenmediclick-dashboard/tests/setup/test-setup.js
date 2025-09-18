
import { jest } from '@jest/globals';
import { afterEach } from '@jest/globals';
console.log('🧪 Cargando configuración de pruebas ZenMediClick...');

// Mocks básicos para el entorno de pruebas
globalThis.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

globalThis.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(), 
  clear: jest.fn()
};

// Mock para fetch
globalThis.fetch = jest.fn();

// Mock para window.location
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: ''
};

// Limpiar mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});

console.log('✅ Configuración de pruebas cargada correctamente');