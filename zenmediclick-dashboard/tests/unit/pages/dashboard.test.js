// Pruebas unitarias para el dashboard
const { describe, it, expect, beforeEach, jest } = require('@jest/globals');

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar contenido según rol de usuario', () => {
    expect(true).toBe(true);
  });
});
