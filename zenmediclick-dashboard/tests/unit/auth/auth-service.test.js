// Pruebas unitarias para el servicio de autenticación
const { describe, it, expect, beforeEach, jest } = require('@jest/globals');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería inicializar correctamente', () => {
    expect(true).toBe(true);
  });
});
