# API Documentation - Devvia v1

La API sigue los principios REST y devuelve respuestas en formato JSON con la estructura `{ success: boolean, data: any, message: string }`.

## 🔒 Autenticación
Todas las rutas marcadas como `[Auth]` requieren el header `Authorization: Bearer <token>`.

### Usuarios
- `POST /api/v1/users/register`: Registro de usuario.
- `POST /api/v1/users/login`: Login tradicional.
- `POST /api/v1/users/google-login`: Login con Google.
- `GET /api/v1/users/profile`: `[Auth]` Obtener perfil.
- `PUT /api/v1/users/profile`: `[Auth]` Actualizar datos.

### Foro (Comunidad)
- `GET /api/v1/forum`: Listar todos los posts.
- `GET /api/v1/forum/:id`: Detalle del post y comentarios.
- `POST /api/v1/forum/comment`: `[Auth]` Crear comentario.
- `PUT /api/v1/forum/comment/:id`: `[Auth]` Editar comentario (Solo dueño).
- `DELETE /api/v1/forum/comment/:id`: `[Auth]` Eliminar comentario (Solo dueño).
- `POST /api/v1/forum/rate/:id`: `[Auth]` Calificar post (1-5 estrellas).

### Catálogo de Proyectos
- `GET /api/v1/projects`: Listar proyectos públicos.
- `POST /api/v1/projects`: `[Auth]` Crear proyecto (Multipart/Form-Data).
- `PUT /api/v1/projects/:id`: `[Auth]` Editar metadatos (Solo dueño).
- `DELETE /api/v1/projects/:id`: `[Auth]` Eliminar proyecto (Solo dueño).
- `GET /api/v1/projects/:id/download`: Descargar ZIP del código fuente.

### Empleos y Otros
- `GET /api/v1/jobs`: Listar vacantes.
- `POST /api/v1/orders/apply`: `[Auth]` Postularse a un empleo.
- `POST /api/v1/support/chat`: Chat con el bot de soporte.
