// Mock de datos de usuario
export const UserDataMock = {
  validUser: {
    id: 1,
    email: 'test@zenmediclick.com',
    password: '$2b$10$hashedpassword',
    role: 'medico',
    active: true,
    firstName: 'Test',
    lastName: 'User'
  },
  inactiveUser: {
    id: 2,
    email: 'inactive@zenmediclick.com',
    password: '$2b$10$hashedpassword',
    role: 'paciente',
    active: false
  },
  adminUser: {
    id: 3,
    email: 'admin@zenmediclick.com',
    password: '$2b$10$hashedpassword',
    role: 'administrador',
    active: true,
    firstName: 'Admin',
    lastName: 'User'
  }
};
