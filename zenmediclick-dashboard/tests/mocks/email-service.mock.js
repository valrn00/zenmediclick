// Mock para el servicio de email
export const EmailServiceMock = {
  sendEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  validateEmailFormat: jest.fn(),
  sendWelcomeEmail: jest.fn(),
  sendAppointmentConfirmation: jest.fn()
};

// Implementaciones por defecto
EmailServiceMock.sendEmail.mockResolvedValue({ success: true, messageId: 'mock-message-id' });
EmailServiceMock.sendPasswordResetEmail.mockResolvedValue({ success: true, message: 'Correo de recuperación enviado' });
EmailServiceMock.validateEmailFormat.mockImplementation((email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
});
