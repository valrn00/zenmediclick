/**
 * ZENMEDICLICK - CONSTANTES GLOBALES
 * Definiciones de constantes utilizadas en todo el sistema
 */

// ==========================================
// ROLES DE USUARIO
// ==========================================

const USER_ROLES = {
    ADMIN: 'admin',
    DOCTOR: 'medico',
    PATIENT: 'paciente'
};

const ROLE_NAMES = {
    [USER_ROLES.ADMIN]: 'Administrador',
    [USER_ROLES.DOCTOR]: 'Médico',
    [USER_ROLES.PATIENT]: 'Paciente'
};

const ROLE_PERMISSIONS = {
    [USER_ROLES.ADMIN]: [
        'manage_users',
        'generate_reports',
        'manage_schedules',
        'view_all_appointments',
        'system_settings'
    ],
    [USER_ROLES.DOCTOR]: [
        'view_appointments',
        'manage_own_schedule',
        'view_patients',
        'update_medical_records'
    ],
    [USER_ROLES.PATIENT]: [
        'book_appointments',
        'view_own_appointments',
        'view_medical_history',
        'update_profile'
    ]
};

// ==========================================
// ESPECIALIDADES MÉDICAS
// ==========================================

const MEDICAL_SPECIALTIES = {
    CARDIOLOGY: 'cardiologia',
    PEDIATRICS: 'pediatria',
    NEUROLOGY: 'neurologia',
    GYNECOLOGY: 'ginecologia',
    TRAUMATOLOGY: 'traumatologia',
    DERMATOLOGY: 'dermatologia',
    OPHTHALMOLOGY: 'oftalmologia',
    PSYCHIATRY: 'psiquiatria',
    RADIOLOGY: 'radiologia',
    ANESTHESIOLOGY: 'anestesiologia'
};

const SPECIALTY_NAMES = {
    [MEDICAL_SPECIALTIES.CARDIOLOGY]: 'Cardiología',
    [MEDICAL_SPECIALTIES.PEDIATRICS]: 'Pediatría',
    [MEDICAL_SPECIALTIES.NEUROLOGY]: 'Neurología',
    [MEDICAL_SPECIALTIES.GYNECOLOGY]: 'Ginecología',
    [MEDICAL_SPECIALTIES.TRAUMATOLOGY]: 'Traumatología',
    [MEDICAL_SPECIALTIES.DERMATOLOGY]: 'Dermatología',
    [MEDICAL_SPECIALTIES.OPHTHALMOLOGY]: 'Oftalmología',
    [MEDICAL_SPECIALTIES.PSYCHIATRY]: 'Psiquiatría',
    [MEDICAL_SPECIALTIES.RADIOLOGY]: 'Radiología',
    [MEDICAL_SPECIALTIES.ANESTHESIOLOGY]: 'Anestesiología'
};

// ==========================================
// ESTADOS DEL SISTEMA
// ==========================================

const USER_STATUSES = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING: 'pending'
};

const APPOINTMENT_STATUSES = {
    SCHEDULED: 'scheduled',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show'
};

const PAYMENT_STATUSES = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
};

// ==========================================
// CONFIGURACIONES DE TIEMPO
// ==========================================

const TIME_CONFIGS = {
    APPOINTMENT_DURATION: 30, // minutos
    BREAK_DURATION: 15, // minutos
    WORKING_HOURS: {
        START: '08:00',
        END: '18:00'
    },
    DAYS_OF_WEEK: [
        'monday',
        'tuesday', 
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
    ]
};

const DAY_NAMES = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles', 
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
};

const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// ==========================================
// CONFIGURACIONES DE VALIDACIÓN
// ==========================================

const VALIDATION_RULES = {
    PASSWORD: {
        MIN_LENGTH: 6,
        REQUIRE_UPPERCASE: false,
        REQUIRE_LOWERCASE: false,
        REQUIRE_NUMBERS: false,
        REQUIRE_SYMBOLS: false
    },
    EMAIL: {
        PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    PHONE: {
        PATTERN: /^[\+]?[1-9][\d]{0,15}$/
    },
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100
    }
};

// ==========================================
// MENSAJES DEL SISTEMA
// ==========================================

const SYSTEM_MESSAGES = {
    SUCCESS: {
        USER_CREATED: '✅ Usuario creado exitosamente',
        USER_UPDATED: '✅ Usuario actualizado correctamente',
        USER_DELETED: '✅ Usuario eliminado correctamente',
        SCHEDULE_SAVED: '💾 Horarios guardados exitosamente',
        REPORT_GENERATED: '📊 Reporte generado correctamente',
        APPOINTMENT_BOOKED: '📅 Cita agendada exitosamente'
    },
    ERROR: {
        USER_NOT_FOUND: '❌ Usuario no encontrado',
        INVALID_EMAIL: '❌ Email inválido',
        INVALID_PHONE: '❌ Teléfono inválido',
        PASSWORD_TOO_SHORT: '❌ La contraseña debe tener al menos 6 caracteres',
        EMAIL_EXISTS: '❌ Ya existe un usuario con este email',
        REQUIRED_FIELDS: '❌ Por favor completa todos los campos obligatorios',
        INVALID_SCHEDULE: '❌ Horario inválido',
        NO_DOCTOR_SELECTED: '❌ Por favor selecciona un médico'
    },
    INFO: {
        LOADING: '🔄 Cargando...',
        PROCESSING: '⏳ Procesando...',
        NO_DATA: 'ℹ️ No hay datos disponibles',
        SEARCH_RESULTS: '🔍 resultados encontrados'
    }
};

// ==========================================
// CONFIGURACIONES DE API
// ==========================================

const API_ENDPOINTS = {
    BASE_URL: '/api/v1',
    USERS: '/users',
    APPOINTMENTS: '/appointments',
    DOCTORS: '/doctors',
    REPORTS: '/reports',
    SCHEDULES: '/schedules',
    AUTH: '/auth'
};

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
};

// ==========================================
// CONFIGURACIONES DE INTERFAZ
// ==========================================

const UI_CONSTANTS = {
    COLORS: {
        PRIMARY: '#4facfe',
        SECONDARY: '#6c757d',
        SUCCESS: '#43e97b',
        WARNING: '#ffc107',
        DANGER: '#dc3545',
        INFO: '#17a2b8'
    },
    ANIMATION_DURATION: {
        FAST: 200,
        NORMAL: 300,
        SLOW: 500
    },
    BREAKPOINTS: {
        MOBILE: 576,
        TABLET: 768,
        DESKTOP: 992,
        LARGE: 1200
    }
};

// ==========================================
// CONFIGURACIONES DE REPORTES
// ==========================================

const REPORT_TYPES = {
    APPOINTMENTS: 'appointments',
    USERS: 'users', 
    CANCELLATIONS: 'cancellations',
    FINANCIAL: 'financial',
    MEDICAL_RECORDS: 'medical_records'
};

const REPORT_FORMATS = {
    PDF: 'pdf',
    EXCEL: 'excel',
    CSV: 'csv',
    JSON: 'json'
};

const REPORT_PERIODS = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly'
};

// ==========================================
// CONFIGURACIONES DE NOTIFICACIONES
// ==========================================

const NOTIFICATION_TYPES = {
    EMAIL: 'email',
    SMS: 'sms',
    PUSH: 'push',
    IN_APP: 'in_app'
};

const NOTIFICATION_PRIORITIES = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent'
};

// ==========================================
// CONFIGURACIONES DE AUDITORÍA
// ==========================================

const AUDIT_ACTIONS = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    VIEW: 'VIEW',
    EXPORT: 'EXPORT',
    IMPORT: 'IMPORT'
};

// ==========================================
// CONFIGURACIONES DE PAGINACIÓN
// ==========================================

const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100]
};

// ==========================================
// EXPORTAR CONSTANTES
// ==========================================

// Hacer constantes disponibles globalmente
if (typeof window !== 'undefined') {
    window.ZenMediClickConstants = {
        USER_ROLES,
        ROLE_NAMES,
        ROLE_PERMISSIONS,
        MEDICAL_SPECIALTIES,
        SPECIALTY_NAMES,
        USER_STATUSES,
        APPOINTMENT_STATUSES,
        PAYMENT_STATUSES,
        TIME_CONFIGS,
        DAY_NAMES,
        MONTH_NAMES,
        VALIDATION_RULES,
        SYSTEM_MESSAGES,
        API_ENDPOINTS,
        HTTP_STATUS,
        UI_CONSTANTS,
        REPORT_TYPES,
        REPORT_FORMATS,
        REPORT_PERIODS,
        NOTIFICATION_TYPES,
        NOTIFICATION_PRIORITIES,
        AUDIT_ACTIONS,
        PAGINATION
    };
}

// Para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        USER_ROLES,
        ROLE_NAMES,
        ROLE_PERMISSIONS,
        MEDICAL_SPECIALTIES,
        SPECIALTY_NAMES,
        USER_STATUSES,
        APPOINTMENT_STATUSES,
        PAYMENT_STATUSES,
        TIME_CONFIGS,
        DAY_NAMES,
        MONTH_NAMES,
        VALIDATION_RULES,
        SYSTEM_MESSAGES,
        API_ENDPOINTS,
        HTTP_STATUS,
        UI_CONSTANTS,
        REPORT_TYPES,
        REPORT_FORMATS,
        REPORT_PERIODS,
        NOTIFICATION_TYPES,
        NOTIFICATION_PRIORITIES,
        AUDIT_ACTIONS,
        PAGINATION
    };
}