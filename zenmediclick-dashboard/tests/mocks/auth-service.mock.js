// Mock para el servicio de autenticación
export const AuthServiceMock = {
  validateCredentials: jest.fn(),
  authenticateUser: jest.fn(),
  getUserRole: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  encryptPassword: jest.fn(),
  generateToken: jest.fn(),
  validateEmail: jest.fn(),
  getRedirectUrl: jest.fn(),
  getPermissionsByRole: jest.fn(),
  validateToken: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn()
};

// Implementaciones por defecto
AuthServiceMock.validateEmail.mockImplementation((email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
});

AuthServiceMock.getRedirectUrl.mockImplementation((user) => {
  const roleRedirects = {
    paciente: '/dashboard/paciente',
    medico: '/dashboard/medico',
    administrador: '/dashboard/administrador'
  };
  return roleRedirects[user.role] || '/dashboard';
});
