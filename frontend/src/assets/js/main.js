// Configuración principal de la aplicación
const ZenmediclickApp = {
    init() {
        this.setupEventListeners();
        this.loadAnimations();
        this.setupScrollEffects();
    },

    setupEventListeners() {
        // Event listeners para botones principales
        document.addEventListener('DOMContentLoaded', () => {
            this.addLoadingEffects();
        });

        // Smooth scroll para navegación interna
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    loadAnimations() {
        // Animaciones de carga
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        // Observar elementos para animación
        document.querySelectorAll('.main-title, .description, .button-group').forEach(el => {
            observer.observe(el);
        });
    },

    addLoadingEffects() {
        // Efecto de carga suave
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                mainContent.style.transition = 'all 0.8s ease';
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
            }, 300);
        }
    },

    setupScrollEffects() {
        // Efecto parallax suave para el logo decorativo
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const logoDecoration = document.querySelector('.logo-decoration');
            
            if (logoDecoration) {
                const speed = scrolled * -0.5;
                logoDecoration.style.transform = `translateY(${speed}px) rotate(-15deg)`;
            }
        });
    },

    // Funciones utilitarias
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '5px',
            color: 'white',
            background: type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3',
            zIndex: '1000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });

        document.body.appendChild(notification);

        // Mostrar notificación
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Funciones globales para los botones
function redirectToLogin() {
    ZenmediclickApp.showNotification('Redirigiendo a iniciar sesión...', 'info');
    setTimeout(() => {
        window.location.href = 'pages/login.html';
    }, 1000);
}

function redirectToRegister() {
    ZenmediclickApp.showNotification('Redirigiendo al registro...', 'info');
    setTimeout(() => {
        window.location.href = 'pages/register.html';
    }, 1000);
}

// Inicializar la aplicación
ZenmediclickApp.init();