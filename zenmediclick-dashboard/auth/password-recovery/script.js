// 💾 BASE DE DATOS SIMULADA (misma estructura que login y register)
const DATABASE = {
    usuarios: [
        // Administradores (solo 3 permitidos)
        { id: 1, nombre: 'Super Administrador', email: 'admin1@zenmediclick.com', password: 'admin123', rol: 'Administrador', id_ips: 1 },
        { id: 2, nombre: 'Admin Técnico', email: 'admin2@zenmediclick.com', password: 'admin123', rol: 'Administrador', id_ips: 1 },
        { id: 3, nombre: 'Admin Sistema', email: 'admin3@zenmediclick.com', password: 'admin123', rol: 'Administrador', id_ips: 1 },
        
        // Médicos pre-registrados
        { id: 4, nombre: 'Dr. Carlos Rodríguez', email: 'medico1@zenmediclick.com', password: 'medico123', rol: 'Medico', id_ips: 1 },
        { id: 5, nombre: 'Dra. Ana Martínez', email: 'medico2@zenmediclick.com', password: 'medico123', rol: 'Medico', id_ips: 1 },
        { id: 6, nombre: 'Dr. Miguel López', email: 'medico3@zenmediclick.com', password: 'medico123', rol: 'Medico', id_ips: 1 },
        
        // Pacientes
        { id: 7, nombre: 'María González', email: 'paciente@test.com', password: 'paciente123', rol: 'Paciente', id_ips: 1 }
    ]
};

// 🔐 CLASE DE RECUPERACIÓN DE CONTRASEÑA
class PasswordRecovery {
    
    // Solicitar recuperación de contraseña
    static async requestRecovery(email, userType) {
        try {
            console.log(`🔄 Solicitando recuperación para: ${email} (${userType})`);
            
            // Simular delay de base de datos
            await this.simulateDBDelay();
            
            // Buscar usuario en la base de datos
            const user = DATABASE.usuarios.find(u => 
                u.email.toLowerCase() === email.toLowerCase() && 
                u.rol === userType
            );
            
            if (!user) {
                throw new Error(`No se encontró una cuenta de ${userType} con este email`);
            }
            
            // Generar código de verificación de 6 dígitos
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // En producción, aquí enviarías el código por email real
            console.log(`📧 Código de recuperación generado: ${verificationCode}`);
            
            // Simular que el código expira en 15 minutos
            const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
            
            // Guardar temporalmente para verificación
            sessionStorage.setItem('recovery_data', JSON.stringify({
                email: email,
                userType: userType,
                userId: user.id,
                verificationCode: verificationCode,
                expiresAt: expiryTime.toISOString()
            }));
            
            console.log(`✅ Código de recuperación enviado para: ${user.nombre}`);
            
            return {
                success: true,
                message: 'Código de recuperación enviado',
                verificationCode: verificationCode, // Solo para demo
                userName: user.nombre
            };
            
        } catch (error) {
            console.error(`❌ Error en recuperación: ${error.message}`);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Verificar código de recuperación
    static async verifyCode(inputCode) {
        try {
            const recoveryData = sessionStorage.getItem('recovery_data');
            if (!recoveryData) {
                throw new Error('No hay proceso de recuperación activo');
            }
            
            const data = JSON.parse(recoveryData);
            
            // Verificar si el código ha expirado
            if (new Date() > new Date(data.expiresAt)) {
                sessionStorage.removeItem('recovery_data');
                throw new Error('El código de verificación ha expirado');
            }
            
            // Verificar el código
            if (inputCode !== data.verificationCode) {
                throw new Error('Código de verificación incorrecto');
            }
            
            console.log('✅ Código verificado correctamente');
            
            return {
                success: true,
                message: 'Código verificado correctamente'
            };
            
        } catch (error) {
            console.error(`❌ Error verificando código: ${error.message}`);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Cambiar contraseña
    static async resetPassword(newPassword) {
        try {
            const recoveryData = sessionStorage.getItem('recovery_data');
            if (!recoveryData) {
                throw new Error('Sesión de recuperación expirada');
            }
            
            const data = JSON.parse(recoveryData);
            
            // Buscar usuario en la base de datos
            const userIndex = DATABASE.usuarios.findIndex(u => u.id === data.userId);
            if (userIndex === -1) {
                throw new Error('Usuario no encontrado');
            }
            
            // Actualizar contraseña en la "base de datos"
            DATABASE.usuarios[userIndex].password = newPassword;
            
            console.log(`✅ Contraseña actualizada para usuario ID: ${data.userId}`);
            console.log(`📊 Usuario actualizado:`, DATABASE.usuarios[userIndex]);
            
            // Limpiar datos de recuperación
            sessionStorage.removeItem('recovery_data');
            
            // Registrar acción en logs de auditoría
            console.log('🔒 AUDIT_LOG: PASSWORD_RESET', {
                userId: data.userId,
                email: data.email,
                userType: data.userType,
                timestamp: new Date().toISOString()
            });
            
            return {
                success: true,
                message: 'Contraseña restablecida correctamente'
            };
            
        } catch (error) {
            console.error(`❌ Error restableciendo contraseña: ${error.message}`);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    static async simulateDBDelay() {
        return new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    }
}

// 🖥️ MANEJO DE LA INTERFAZ DE USUARIO

let currentStep = 1;
let generatedCode = '';

// Paso 1: Solicitar recuperación
document.getElementById('requestForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('recoveryEmail').value;
    const userType = document.getElementById('recoveryUserType').value;
    
    if (!email || !userType) {
        showMessage('❌ Por favor completa todos los campos', 'error');
        return;
    }
    
    const btn = document.getElementById('requestBtn');
    btn.classList.add('loading');
    btn.disabled = true;
    
    try {
        const result = await PasswordRecovery.requestRecovery(email, userType);
        
        if (result.success) {
            generatedCode = result.verificationCode;
            document.getElementById('demoCode').textContent = generatedCode;
            
            showMessage(`✅ Código enviado a ${email}`, 'success');
            goToStep(2);
        } else {
            showMessage(`❌ ${result.message}`, 'error');
        }
        
    } catch (error) {
        showMessage('❌ Error de conexión. Intenta nuevamente.', 'error');
    }
    
    btn.classList.remove('loading');
    btn.disabled = false;
});

// Paso 2: Verificar código
document.getElementById('verifyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const code = document.getElementById('verificationCode').value;
    
    if (!code || code.length !== 6) {
        showMessage('❌ Ingresa el código de 6 dígitos', 'error');
        return;
    }
    
    const btn = document.getElementById('verifyBtn');
    btn.classList.add('loading');
    btn.disabled = true;
    
    const result = await PasswordRecovery.verifyCode(code);
    
    if (result.success) {
        showMessage(`✅ ${result.message}`, 'success');
        goToStep(3);
    } else {
        showMessage(`❌ ${result.message}`, 'error');
    }
    
    btn.classList.remove('loading');
    btn.disabled = false;
});

// Paso 3: Nueva contraseña
document.getElementById('resetForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (!newPassword || !confirmPassword) {
        showMessage('❌ Por favor completa todos los campos', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showMessage('❌ Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (!validatePasswordRequirements(newPassword)) {
        showMessage('❌ La contraseña no cumple los requisitos mínimos', 'error');
        return;
    }
    
    const btn = document.getElementById('resetBtn');
    btn.classList.add('loading');
    btn.disabled = true;
    
    const result = await PasswordRecovery.resetPassword(newPassword);
    
    if (result.success) {
        showMessage(`✅ ${result.message}`, 'success');
        setTimeout(() => goToStep(4), 1500);
    } else {
        showMessage(`❌ ${result.message}`, 'error');
    }
    
    btn.classList.remove('loading');
    btn.disabled = false;
});

// Validación en tiempo real de contraseña
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('newPassword');
    const confirmInput = document.getElementById('confirmNewPassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePasswordUI(this.value);
            updatePasswordStrength(this.value);
        });
    }
    
    if (confirmInput) {
        confirmInput.addEventListener('input', function() {
            const password = document.getElementById('newPassword').value;
            validatePasswordMatch(password, this.value);
        });
    }
});

// Funciones auxiliares
function goToStep(step) {
    // Ocultar paso actual
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    
    // Mostrar nuevo paso
    document.getElementById(`step${step}`).classList.add('active');
    
    // Actualizar barra de progreso
    const progress = (step / 4) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    
    currentStep = step;
    console.log(`📍 Paso actual: ${step}`);
}

function showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    container.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function resendCode() {
    // Generar nuevo código
    generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById('demoCode').textContent = generatedCode;
    
    // Actualizar en sessionStorage
    const recoveryData = JSON.parse(sessionStorage.getItem('recovery_data') || '{}');
    recoveryData.verificationCode = generatedCode;
    recoveryData.expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    sessionStorage.setItem('recovery_data', JSON.stringify(recoveryData));
    
    showMessage('📧 Nuevo código enviado', 'success');
}

function validatePasswordRequirements(password) {
    return password.length >= 6 && 
           /[A-Z]/.test(password) && 
           /\d/.test(password);
}

function validatePasswordUI(password) {
    // Validar longitud
    updateRequirement('req-length', password.length >= 6);
    
    // Validar mayúscula
    updateRequirement('req-upper', /[A-Z]/.test(password));
    
    // Validar número
    updateRequirement('req-number', /\d/.test(password));
    
    // Validar que coincida si el otro campo no está vacío
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    if (confirmPassword) {
        validatePasswordMatch(password, confirmPassword);
    }
}

function validatePasswordMatch(password, confirmPassword) {
    updateRequirement('req-match', password === confirmPassword && password !== '');
}

function updateRequirement(id, isValid) {
    const element = document.getElementById(id);
    const icon = element.querySelector('.icon');
    
    element.classList.toggle('valid', isValid);
    element.classList.toggle('invalid', !isValid);
    icon.textContent = isValid ? '✅' : '❌';
}

function updatePasswordStrength(password) {
    let strength = 0;
    const strengthBar = document.getElementById('strengthBar');
    
    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    
    strengthBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
    
    if (strength === 1) {
        strengthBar.classList.add('strength-weak');
    } else if (strength === 2) {
        strengthBar.classList.add('strength-medium');
    } else if (strength >= 3) {
        strengthBar.classList.add('strength-strong');
    }
}

function goToLogin() {
    window.location.href = 'login.html';
}