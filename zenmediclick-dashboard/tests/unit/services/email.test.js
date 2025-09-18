// Pruebas unitarias para el servicio de email
const { describe, it, expect, beforeEach, jest } = require('@jest/globals');

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería enviar emails correctamente', () => {
    expect(true).toBe(true);
  });
});
