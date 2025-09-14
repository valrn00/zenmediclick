// Manejo de navegación y rutas
const NavigationManager = {
    routes: {
        home: 'index.html',
        login: 'pages/login.html',
        register: 'pages/register.html',
        appointment: 'pages/appointment.html'
    },

    init() {
        this.setupNavigation();
        this.highlightCurrentPage();
    },

    setupNavigation() {
        // Manejar clics en navegación
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigateTo(href);
            });
        });

        // Manejar botón del logo
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', () => {
                this.navigateTo(this.routes.home);
            });
        }
    },

    navigateTo(url) {
        // Efecto de transición antes de navegar
        const container = document.querySelector('.container');
        if (container) {
            container.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            container.style.transform = 'scale(0.95)';
            container.style.opacity = '0.7';
            
            setTimeout(() => {
                window.location.href = url;
            }, 300);
        } else {
            window.location.href = url;
        }
    },

    highlightCurrentPage() {
        // Resaltar página actual en navegación
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref.includes(currentPage) || 
                (currentPage === 'index.html' && linkHref === '/')) {
                link.style.color = '#7c4dff';
                link.style.background = 'rgba(124, 77, 255, 0.1)';
            }
        });
    },

    handleNavigation(section) {
        const route = this.routes[section];
        if (route) {
            ZenmediclickApp.showNotification(`Navegando a ${section}...`, 'info');
            setTimeout(() => {
                this.navigateTo(route);
            }, 500);
        } else {
            console.error('Ruta no encontrada:', section);
        }
    }
};

// Inicializar navegación
document.addEventListener('DOMContentLoaded', () => {
    NavigationManager.init();
});

// Función global para navegación desde HTML
function handleNavigation(section) {
    NavigationManager.handleNavigation(section);
}