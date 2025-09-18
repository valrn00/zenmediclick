// Mocks globales para ZenMediClick Dashboard

// Mock del servicio de base de datos
export const DatabaseMock = {
  findUserByEmail: jest.fn(),
  validateUserCredentials: jest.fn(),
  updateUserPassword: jest.fn(),
  logLoginAttempt: jest.fn(),
  createPasswordResetToken: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn()
};

// Mock del servicio de autenticación
export const AuthMock = {
  validateCredentials: jest.fn(),
  authenticateUser: jest.fn(),
  getUserRole: jest.fn(),
  generateToken: jest.fn(),
  validateToken: jest.fn(),
  encryptPassword: jest.fn(),
  getRedirectUrl: jest.fn(),
  getPermissionsByRole: jest.fn()
};

// Mock del servicio de email
export const EmailMock = {
  sendEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  validateEmailFormat: jest.fn()
};
