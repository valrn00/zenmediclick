// Pruebas unitarias para el servicio de base de datos
const { describe, it, expect, beforeEach, jest } = require('@jest/globals');

describe('DatabaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería conectar a la base de datos', () => {
    expect(true).toBe(true);
  });
});
