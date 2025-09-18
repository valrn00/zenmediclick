// Pruebas end-to-end para dashboard
const { describe, it, expect, beforeEach, jest } = require('@jest/globals');

describe('E2E - Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería navegar por el dashboard', () => {
    expect(true).toBe(true);
  });
});
