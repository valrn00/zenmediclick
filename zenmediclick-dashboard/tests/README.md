# ZenMediClick Dashboard - Pruebas

## Estructura de Pruebas

Este directorio contiene todas las pruebas para el sistema ZenMediClick Dashboard.

### Tipos de Pruebas

- **unit/**: Pruebas unitarias para componentes individuales
- **integration/**: Pruebas de integración entre módulos
- **e2e/**: Pruebas end-to-end del flujo completo de usuario
- **fixtures/**: Datos de prueba reutilizables
- **mocks/**: Mocks para servicios externos
- **setup/**: Configuración global de testing

### Comandos Disponibles

```bash
npm test                    # Todas las pruebas
npm run test:unit          # Solo pruebas unitarias
npm run test:auth          # Solo pruebas de autenticación
npm run test:coverage      # Con reporte de cobertura
npm run test:watch         # Modo desarrollo
```

### Escribir Nuevas Pruebas

1. Ubicar en la carpeta apropiada (unit/integration/e2e)
2. Seguir la convención de nombres: `*.test.js`
3. Usar los mocks disponibles en `/mocks`
4. Incluir datos de prueba desde `/fixtures`
