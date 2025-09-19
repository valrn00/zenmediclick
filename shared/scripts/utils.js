/**
 * ZENMEDICLICK - UTILIDADES GLOBALES
 * Funciones utilitarias reutilizables en todo el sistema
 */

// ==========================================
// VALIDACIONES
// ==========================================

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    return VALIDATION_RULES.EMAIL.PATTERN.test(email.trim());
}

/**
 * Validar teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
function validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    return VALIDATION_RULES.PHONE.PATTERN.test(phone.trim());
}

/**
 * Validar contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} Resultado de validación
 */
function validatePassword(password) {
    const result = {
        isValid: false,
        errors: []
    };
    
    if (!password || typeof password !== 'string') {
        result.errors.push('La contraseña es requerida');
        return result;
    }
    
    if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
        result.errors.push(`La contraseña debe tener al menos ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} caracteres`);
    }
    
    if (VALIDATION_RULES.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
        result.errors.push('La contraseña debe contener al menos una mayúscula');
    }
    
    if (VALIDATION_RULES.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
        result.errors.push('La contraseña debe contener al menos una minúscula');
    }
    
    if (VALIDATION_RULES.PASSWORD.REQUIRE_NUMBERS && !/\d/.test(password)) {
        result.errors.push('La contraseña debe contener al menos un número');
    }
    
    if (VALIDATION_RULES.PASSWORD.REQUIRE_SYMBOLS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        result.errors.push('La contraseña debe contener al menos un símbolo especial');
    }
    
    result.isValid = result.errors.length === 0;
    return result;
}

/**
 * Validar nombre
 * @param {string} name - Nombre a validar
 * @returns {Object} Resultado de validación
 */
function validateName(name) {
    const result = {
        isValid: false,
        error: null
    };
    
    if (!name || typeof name !== 'string') {
        result.error = 'El nombre es requerido';
        return result;
    }
    
    const trimmedName = name.trim();
    
    if (trimmedName.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
        result.error = `El nombre debe tener al menos ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`;
        return result;
    }
    
    if (trimmedName.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
        result.error = `El nombre no puede exceder ${VALIDATION_RULES.NAME.MAX_LENGTH} caracteres`;
        return result;
    }
    
    result.isValid = true;
    return result;
}

// ==========================================
// FORMATEO DE DATOS
// ==========================================

/**
 * Formatear fecha para mostrar
 * @param {string|Date} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} Fecha formateada
 */
function formatDate(date, options = {}) {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return 'Fecha inválida';
    
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };
    
    return dateObj.toLocaleDateString('es-ES', defaultOptions);
}

/**
 * Formatear tiempo
 * @param {string} time - Tiempo en formato HH:MM
 * @param {boolean} use12Hour - Usar formato 12 horas
 * @returns {string} Tiempo formateado
 */
function formatTime(time, use12Hour = false) {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) return 'Hora inválida';
    
    if (!use12Hour) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Formatear número con separadores de miles
 * @param {number} number - Número a formatear
 * @param {string} locale - Locale para formato
 * @returns {string} Número formateado
 */
function formatNumber(number, locale = 'es-ES') {
    if (typeof number !== 'number' || isNaN(number)) return '0';
    
    return number.toLocaleString(locale);
}

/**
 * Formatear moneda
 * @param {number} amount - Cantidad
 * @param {string} currency - Código de moneda
 * @param {string} locale - Locale
 * @returns {string} Cantidad formateada
 */
function formatCurrency(amount, currency = 'COP', locale = 'es-CO') {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0';
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Formatear porcentaje
 * @param {number} value - Valor
 * @param {number} total - Total
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} Porcentaje formateado
 */
function formatPercentage(value, total, decimals = 1) {
    if (typeof value !== 'number' || typeof total !== 'number' || total === 0) {
        return '0%';
    }
    
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(decimals)}%`;
}

// ==========================================
// MANIPULACIÓN DE STRINGS
// ==========================================

/**
 * Capitalizar primera letra
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
function capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convertir a title case
 * @param {string} str - String a convertir
 * @returns {string} String en title case
 */
function toTitleCase(str) {
    if (!str || typeof str !== 'string') return '';
    
    return str.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

/**
 * Remover acentos
 * @param {string} str - String con acentos
 * @returns {string} String sin acentos
 */
function removeAccents(str) {
    if (!str || typeof str !== 'string') return '';
    
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Generar slug
 * @param {string} text - Texto para slug
 * @returns {string} Slug generado
 */
function generateSlug(text) {
    if (!text || typeof text !== 'string') return '';
    
    return removeAccents(text)
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ==========================================
// MANIPULACIÓN DE FECHAS
// ==========================================

/**
 * Agregar días a una fecha
 * @param {Date} date - Fecha base
 * @param {number} days - Días a agregar
 * @returns {Date} Nueva fecha
 */
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Obtener diferencia en días
 * @param {Date} date1 - Primera fecha
 * @param {Date} date2 - Segunda fecha
 * @returns {number} Diferencia en días
 */
function getDaysDifference(date1, date2) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((date2.getTime() - date1.getTime()) / msPerDay);
}

/**
 * Verificar si es el mismo día
 * @param {Date} date1 - Primera fecha
 * @param {Date} date2 - Segunda fecha
 * @returns {boolean} True si es el mismo día
 */
function isSameDay(date1, date2) {
    return date1.toDateString() === date2.toDateString();
}

/**
 * Obtener inicio de semana
 * @param {Date} date - Fecha
 * @returns {Date} Inicio de semana
 */
function getWeekStart(date) {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day + (day === 0 ? -6 : 1);
    result.setDate(diff);
    result.setHours(0, 0, 0, 0);
    return result;
}

/**
 * Obtener fin de semana
 * @param {Date} date - Fecha
 * @returns {Date} Fin de semana
 */
function getWeekEnd(date) {
    const result = getWeekStart(date);
    result.setDate(result.getDate() + 6);
    result.setHours(23, 59, 59, 999);
    return result;
}

// ==========================================
// UTILIDADES DE ARRAY
// ==========================================

/**
 * Agrupar array por propiedad
 * @param {Array} array - Array a agrupar
 * @param {string} key - Propiedad para agrupar
 * @returns {Object} Objeto agrupado
 */
function groupBy(array, key) {
    if (!Array.isArray(array)) return {};
    
    return array.reduce((groups, item) => {
        const group = item[key];
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
}

/**
 * Remover duplicados de array
 * @param {Array} array - Array con duplicados
 * @param {string} key - Propiedad única (opcional)
 * @returns {Array} Array sin duplicados
 */
function removeDuplicates(array, key = null) {
    if (!Array.isArray(array)) return [];
    
    if (key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) return false;
            seen.add(value);
            return true;
        });
    }
    
    return [...new Set(array)];
}

/**
 * Ordenar array por propiedad
 * @param {Array} array - Array a ordenar
 * @param {string} key - Propiedad para ordenar
 * @param {string} order - 'asc' o 'desc'
 * @returns {Array} Array ordenado
 */
function sortBy(array, key, order = 'asc') {
    if (!Array.isArray(array)) return [];
    
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

// ==========================================
// UTILIDADES DE OBJETO
// ==========================================

/**
 * Clonar objeto profundo
 * @param {Object} obj - Objeto a clonar
 * @returns {Object} Objeto clonado
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * Verificar si objeto está vacío
 * @param {Object} obj - Objeto a verificar
 * @returns {boolean} True si está vacío
 */
function isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * Obtener valor anidado seguro
 * @param {Object} obj - Objeto
 * @param {string} path - Ruta (ej: 'user.profile.name')
 * @param {*} defaultValue - Valor por defecto
 * @returns {*} Valor encontrado o por defecto
 */
function safeGet(obj, path, defaultValue = null) {
    if (!obj || typeof path !== 'string') return defaultValue;
    
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
        if (result === null || result === undefined || !(key in result)) {
            return defaultValue;
        }
        result = result[key];
    }
    
    return result;
}

// ==========================================
// UTILIDADES DE TIEMPO Y RENDIMIENTO
// ==========================================

/**
 * Debounce function
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function} Función con throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Delay/Sleep function
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promise que se resuelve después del delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================
// UTILIDADES DE ID Y RANDOM
// ==========================================

/**
 * Generar ID único
 * @param {number} length - Longitud del ID
 * @returns {string} ID único
 */
function generateUniqueId(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generar UUID v4
 * @returns {string} UUID
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Generar número aleatorio en rango
 * @param {number} min - Mínimo
 * @param {number} max - Máximo
 * @returns {number} Número aleatorio
 */
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==========================================
// EXPORTAR UTILIDADES
// ==========================================

// Hacer utilidades disponibles globalmente
if (typeof window !== 'undefined') {
    window.ZenMediClickUtils = {
        // Validaciones
        validateEmail,
        validatePhone,
        validatePassword,
        validateName,
        
        // Formateo
        formatDate,
        formatTime,
        formatNumber,
        formatCurrency,
        formatPercentage,
        
        // Strings
        capitalize,
        toTitleCase,
        removeAccents,
        generateSlug,
        
        // Fechas
        addDays,
        getDaysDifference,
        isSameDay,
        getWeekStart,
        getWeekEnd,
        
        // Arrays
        groupBy,
        removeDuplicates,
        sortBy,
        
        // Objetos
        deepClone,
        isEmptyObject,
        safeGet,
        
        // Tiempo/Rendimiento
        debounce,
        throttle,
        delay,
        
        // ID/Random
        generateUniqueId,
        generateUUID,
        randomInRange
    };
}