// Mock para el servicio de base de datos
const users = require('../fixtures/users.json');

export const DatabaseServiceMock = {
  findUserByEmail: jest.fn(),
  validateUserCredentials: jest.fn(),
  updateUserPassword: jest.fn(),
  logLoginAttempt: jest.fn(),
  createPasswordResetToken: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn()
};

// Implementaciones por defecto con datos de fixtures
DatabaseServiceMock.findUserByEmail.mockImplementation((email) => {
  const allUsers = [...users.validUsers, ...users.inactiveUsers];
  return Promise.resolve(allUsers.find(user => user.email === email) || null);
});

DatabaseServiceMock.validateUserCredentials.mockImplementation((plainPassword, hashedPassword) => {
  // Simulación simple de validación
  return Promise.resolve(hashedPassword.includes('hashedpassword'));
});
