USE zenmediclick;

INSERT INTO ips (nombre, direccion, telefono, email) VALUES
('IPS Central', 'Calle 123 #4-56', '6011234567', 'info@ipscentral.com'),
('Clínica del Sol', 'Carrera 7 #8-90', '6019876543', 'contacto@clinicadelsol.com'),
('Hospital del Valle', 'Avenida 4 #5-67', '6012345678', 'admin@hospitalvalle.com'),
('IPS del Norte', 'Calle 50 #10-20', '6014445555', 'info@ipsnorte.com'),
('Centro de Salud Sur', 'Carrera 3 #2-10', '6016667777', 'contacto@saludsur.com');

INSERT INTO usuarios (nombre, cedula, email, password, rol, id_ips) VALUES
('Ana García', '1001001001', 'ana.garcia@email.com', 'hashedpass_ana', 'Paciente', NULL),
('Carlos López', '2002002002', 'carlos.lopez@email.com', 'hashedpass_carlos', 'Paciente', 1),
('Dr. Juan Pérez', '3003003003', 'juan.perez@medico.com', 'hashedpass_juan', 'Medico', 2),
('Sofía Rodríguez', '5005005005', 'sofia.rodriguez@email.com', 'hashedpass_sofia', 'Paciente', NULL),
('Dra. Elena Gómez', '6006006006', 'elena.gomez@medico.com', 'hashedpass_elena', 'Medico', 3),
('Dr. Andrés Castro', '7007007007', 'andres.castro@medico.com', 'hashedpass_andres', 'Medico', 4),
('Dra. Isabel Vargas', '8008008008', 'isabel.vargas@medico.com', 'hashedpass_isabel', 'Medico', 5),
('Javier Quintero', '9009009009', 'javier.q@email.com', 'hashedpass_javier', 'Paciente', 2),
('Dr. Ricardo Soto', '1010101010', 'ricardo.soto@medico.com', 'hashedpass_ricardo', 'Medico', 1),
('Mónica Guzmán', '1111111111', 'monica.g@email.com', 'hashedpass_monica', 'Paciente', NULL);

INSERT INTO pacientes (id_usuario, id_ips) VALUES
(1, NULL),
(4, NULL),
(10, NULL),
(2, 1),
(8, 2);

INSERT INTO medicos (id_usuario, especialidad, id_ips) VALUES
(3, 'Cardiología', 2),
(5, 'Pediatría', 3),
(6, 'Oftalmología', 4),
(7, 'Ginecología', 5),
(9, 'Urología', 1);

INSERT INTO consultorios (nombre, ubicacion, id_ips) VALUES
('Consultorio 101', 'Piso 1 - Ala A', 1),
('Consultorio 202', 'Piso 2 - Ala B', 1),
('Consultorio 301', 'Piso 3 - Frente a radiología', 2),
('Consultorio Pediatría', 'Piso 1 - Zona infantil', 3),
('Consultorio Ginecología', 'Piso 2 - Sector B', 5),
('Consultorio Oftalmología', 'Piso 3 - Oficina 305', 4),
('Consultorio Cardiología', 'Piso 2 - Oficina 204', 2),
('Consultorio General', 'Entrada principal', 1);

INSERT INTO citas (fecha, motivo, estado, id_paciente, id_medico) VALUES
('2025-07-10 10:00:00', 'Consulta general por chequeo anual', 'Pendiente', 1, 3),
('2025-07-11 14:30:00', 'Revisión pediátrica de rutina', 'Confirmada', 2, 5),
('2025-07-15 09:00:00', 'Dolor de cabeza persistente', 'Pendiente', 4, 3),
('2025-07-20 11:00:00', 'Seguimiento de condición crónica', 'Pendiente', 8, 5),
('2025-07-22 16:00:00', 'Examen de control', 'Cancelada', 10, 3),
('2025-07-25 09:00:00', 'Revisión de la vista', 'Pendiente', 1, 6),
('2025-07-26 10:00:00', 'Consulta ginecológica', 'Pendiente', 2, 7);

INSERT INTO historial_medico (descripcion, fecha, id_paciente, id_cita) VALUES
('Chequeo anual completado. Paciente en buen estado general.', '2025-07-10', 1, 1),
('Revisión pediátrica. Vacunas al día.', '2025-07-11', 2, 2),
('Diagnóstico de migraña. Se prescribe medicación.', '2025-07-15', 4, 3),
('Seguimiento de diabetes tipo 2. Ajuste de insulina.', '2025-07-20', 8, 4),
('Revisión de la vista. Agudeza visual 20/20.', '2025-07-25', 1, 6);

INSERT INTO observaciones (contenido, fecha, id_cita) VALUES
('Paciente refiere mejora en el dolor de cabeza.', '2025-07-15 09:30:00', 3),
('Se recomienda análisis de sangre.', '2025-07-10 10:45:00', 1),
('Revisión de vacunas al día.', '2025-07-11 15:00:00', 2),
('Paciente con buena visión.', '2025-07-25 09:30:00', 6),
('Primera consulta ginecológica.', '2025-07-26 10:45:00', 7);

INSERT INTO recordatorios (mensaje, fecha_envio, id_cita) VALUES
('Recordatorio: Su cita de chequeo anual es el 10 de julio a las 10 AM.', '2025-07-08 09:00:00', 1),
('Recordatorio: Cita pediátrica el 11 de julio.', '2025-07-09 10:00:00', 2),
('Recordatorio: Revisión de dolor de cabeza el 15 de julio.', '2025-07-13 11:00:00', 3),
('Recordatorio: Cita de oftalmología el 25 de julio.', '2025-07-23 09:00:00', 6),
('Recordatorio: Cita ginecológica el 26 de julio.', '2025-07-24 10:00:00', 7);
