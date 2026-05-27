# Arquitectura del Sistema - Devvia

Devvia utiliza una arquitectura **MERN** (MongoDB, Express, React, Node.js) con un enfoque en modularidad y separación de responsabilidades.

## 1. Stack Tecnológico

### Frontend (SPA)
- **React 19**: Framework base para la interfaz de usuario.
- **TypeScript**: Garantiza la seguridad de tipos en todo el frontend.
- **Tailwind CSS**: Framework de utilidades para un diseño moderno y responsivo.
- **i18next**: Gestión de traducciones dinámicas (ES/EN).
- **Axios**: Cliente HTTP con interceptores para manejo automático de tokens y desempaquetado de datos.

### Backend (REST API)
- **Node.js + Express 5**: Entorno de ejecución y framework de servidor.
- **JWT (JSON Web Token)**: Manejo de sesiones sin estado (Stateless).
- **Mongoose**: ODM para modelado de datos en MongoDB.
- **Multer**: Middleware para la gestión de carga de archivos (Multipart/Form-Data).
- **JSZip**: Generación dinámica de archivos comprimidos para descarga de código.

## 2. Organización del Código

### Backend (Patrón Service-Controller)
1. **Routes**: Define los puntos de entrada (v1).
2. **Controllers**: Maneja la lógica HTTP (req, res) y usa `catchAsync` para errores.
3. **Services**: Contiene la lógica de negocio y comunicación con la DB.
4. **Models**: Define los esquemas de datos.

### Frontend (Component-Based)
1. **Components**: Elementos de UI reutilizables.
2. **Pages**: Vistas principales de la aplicación.
3. **Context**: Manejo de estado global (AuthContext).
4. **Services**: Abstracción de llamadas a la API.

## 3. Flujo de Datos y Seguridad
- **Autenticación**: Los usuarios obtienen un JWT al loguearse. Este se guarda en `localStorage` y se envía automáticamente en cada petición mediante un interceptor de Axios.
- **Permisos**: Tanto el frontend (ocultando botones) como el backend (validando `userId`) aseguran que solo los dueños puedan editar o eliminar recursos.
- **Base de Datos**: MongoDB configurado en puerto 27018 local para evitar conflictos de sistema.
