import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PasswordRecovery.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('active'); // 'active', 'success', 'error'
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Obtener el token de la URL: /reset-password?token=XYZ
    const token = searchParams.get('token');

    // Comprobación inicial del token
    useEffect(() => {
        if (!token) {
            setStatus('error');
            alert("Token de restablecimiento no encontrado en la URL.");
            // Opcional: Redirigir al inicio de recuperación después de un tiempo
            setTimeout(() => navigate('/recovery'), 3000); 
        }
    }, [token, navigate]);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        
        // Aquí se incorpora la lógica de tu script original
        try {
            const response = await fetch("http://localhost:5000/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }) // Usa el token de la URL
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                // Redirigir al login después de un breve éxito
                setTimeout(() => navigate('/login'), 5000); 
            } else {
                setStatus('error');
                alert(data.message || "Error al cambiar contraseña. El token podría ser inválido o haber expirado.");
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            alert("Error de conexión al servidor.");
        }
    };

    // Componente de Requisitos de Contraseña (Requisitos del HTML original)
    const PasswordRequirements = () => {
        const isLengthValid = newPassword.length >= 6;
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

        const getIcon = (isValid) => <span className="icon">{isValid ? '✅' : '❌'}</span>;

        return (
            <div className="password-requirements">
                <strong>Requisitos de la contraseña:</strong>
                <div className="requirement" id="req-length">
                    {getIcon(isLengthValid)}
                    <span>Mínimo 6 caracteres</span>
                </div>
                <div className="requirement" id="req-upper">
                    {getIcon(hasUpperCase)}
                    <span>Al menos una mayúscula</span>
                </div>
                <div className="requirement" id="req-number">
                    {getIcon(hasNumber)}
                    <span>Al menos un número</span>
                </div>
                <div className="requirement" id="req-match">
                    {getIcon(passwordsMatch)}
                    <span>Las contraseñas coinciden</span>
                </div>
            </div>
        );
    };


    return (
        <div className="recovery-page-wrapper">
            <div className="recovery-container">
                <div className="recovery-header">
                    <h1>🔒 Nueva Contraseña</h1>
                    <p>Crea una nueva contraseña segura para tu cuenta</p>
                </div>

                <div className="recovery-content">
                    {/* Mensaje de Carga/Error */}
                    {status === 'error' && (
                         <div className="message error">
                            <strong>❌ Error:</strong> Token inválido o expirado. Por favor, solicita una nueva recuperación.
                         </div>
                    )}

                    {/* Formulario (Muestra solo si el token existe y no ha habido éxito) */}
                    {status === 'active' && token && (
                        <>
                            <p className="light-text-color" style={{ marginBottom: '25px', textAlign: 'left' }}>
                                Ingresa la nueva contraseña. El enlace es válido solo por tiempo limitado.
                            </p>
                            <form onSubmit={handleResetPassword}>
                                <div className="form-group">
                                    <label htmlFor="newPassword">Nueva Contraseña</label>
                                    <input 
                                        type="password" 
                                        id="newPassword" 
                                        placeholder="Mínimo 6 caracteres"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required 
                                    />
                                    <div className="password-strength">
                                        <div className="password-strength-bar" style={{width: '0%'}}></div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</label>
                                    <input 
                                        type="password" 
                                        id="confirmNewPassword" 
                                        placeholder="Confirma la nueva contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                                <PasswordRequirements />
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
                                    🔐 Cambiar Contraseña
                                </button>
                            </form>
                            <div className="back-link">
                                <Link to="/login">← Volver al Login</Link>
                            </div>
                        </>
                    )}

                    {/* Mensaje de Éxito */}
                    {status === 'success' && (
                        <div className="success-message">
                            <div className="success-icon">🎉</div>
                            <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>¡Contraseña Restablecida!</h3>
                            <div className="message success">
                                <strong>✅ Éxito:</strong> Tu contraseña ha sido cambiada y serás redirigido al Login.
                            </div>
                            <button className="btn btn-primary" onClick={() => navigate('/login')}>
                                🏠 Ir a Iniciar Sesión Ahora
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;