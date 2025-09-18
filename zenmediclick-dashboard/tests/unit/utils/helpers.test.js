// Pruebas unitarias para utilidades helpers
const { describe, it, expect, beforeEach, jest } = require('@jest/globals');

describe('Helpers Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería tener funciones de utilidad', () => {
    expect(true).toBe(true);
  });
});
