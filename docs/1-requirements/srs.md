# Especificación de Requerimientos de Software (SRS) - Devvia

## 1. Introducción
### 1.1 Propósito
El propósito de este documento es definir los requerimientos funcionales y no funcionales para la plataforma Devvia, diseñada para conectar desarrolladores trainee con empresas y recursos de aprendizaje.

### 1.2 Alcance
Devvia es una plataforma web que incluye autenticación, catálogo de proyectos (CRUD), comunidad/foro con interacción en tiempo real, portal de empleo y un chatbot de soporte inteligente.

## 2. Descripción General
### 2.1 Funcionalidades del Producto
- **Gestión de Usuarios**: Registro, Login (tradicional y Google), Perfil de usuario, Seguridad 2FA.
- **Catálogo de Proyectos**: Subida de código fuente (ZIP o archivos individuales), visualización de código, gestión de proyectos propios (editar/eliminar).
- **Comunidad (Foro)**: Creación de discusiones, sistema de comentarios (CRUD) y valoraciones.
- **Portal de Talento**: Listado de empleos, sistema de "match" por habilidades y gestión de postulaciones.
- **Soporte de Chat**: Chatbot basado en etiquetas para dudas técnicas y de carrera.

## 3. Requerimientos Específicos

### 3.1 Requerimientos Funcionales
| ID | Requerimiento | Descripción |
|----|--------------|-------------|
| RF-01 | Autenticación Social | El usuario debe poder ingresar con su cuenta de Google. |
| RF-02 | Gestión de Proyectos | El dueño de un proyecto puede editar metadatos o eliminar su repositorio. |
| RF-03 | Comentarios CRUD | Los usuarios pueden editar y eliminar sus propios comentarios en el foro. |
| RF-04 | Internacionalización | La interfaz debe soportar español e inglés (i18n). |
| RF-05 | Descarga de Código | El código de los proyectos debe poder descargarse en formato .ZIP. |

### 3.2 Requerimientos No Funcionales
- **Seguridad**: Uso de JWT para sesiones y Bcrypt para contraseñas.
- **Usabilidad**: Diseño responsivo y modo oscuro integrado.
- **Mantenibilidad**: Código modular siguiendo el patrón Service-Controller.
- **Fiabilidad**: Pruebas unitarias para lógica crítica en backend y frontend.

## 4. Atributos del Sistema
- **Escalabilidad**: Rutas de API versionadas (v1).
- **Disponibilidad**: Manejo de errores que no tumba el servidor si falla la DB.
