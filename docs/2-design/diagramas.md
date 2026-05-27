# Información para Diagramas - Devvia

## 1. Diagrama Entidad-Relación (ER)
**Entidades Principales y Relaciones:**
- **Usuario**: `_id`, `nombre`, `email`, `password`.
- **Proyecto**: `_id`, `nombre`, `descripcion`, `usuario_id` (FK a Usuario). (Un usuario puede tener múltiples proyectos; relación 1 a N).
- **Comentario**: `_id`, `contenido`, `fecha`, `usuario_id` (FK a Usuario), `foro_id`. (Un usuario puede realizar múltiples comentarios; relación 1 a N).
- **Postulacion**: `_id`, `estado`, `fecha`, `usuario_id` (FK a Usuario), `empleo_id`. (Un usuario puede tener múltiples postulaciones; relación 1 a N).
- **Soporte (Mensaje)**: `_id`, `mensaje`, `fecha`, `usuario_id` (FK a Usuario). (Un usuario puede generar múltiples mensajes de soporte; relación 1 a N).

## 2. Diagrama UML: Estados
**Estado de un Usuario en la Plataforma:**
1. **Visitante (Anónimo)**: Puede ver Home, Portal de Empleos, leer Foros, usar Soporte básico.
2. **Autenticando**: Intento de login o registro. Si es exitoso pasa a Autenticado.
3. **Autenticado (Usuario Logueado)**: Se habilitan funciones de Comentar, Postularse, Modificar Perfil, Publicar Proyectos, Configurar 2FA.
4. **Deslogueado**: Cierra sesión y vuelve al estado Visitante.

## 3. Diagrama UML: Actividades
**Flujo de Postulación a un Empleo:**
1. **Inicio**: El usuario ingresa a la sección "Portal" (Bolsa de Trabajo).
2. **Acción**: El usuario busca un empleo utilizando los filtros.
3. **Decisión**: ¿El usuario encuentra un empleo de interés?
   - NO: Fin de actividad o nueva búsqueda.
   - SÍ: El usuario hace clic en el empleo.
4. **Decisión**: ¿El usuario está logueado?
   - NO: Mostrar cuadro de diálogo "Debe registrarse para continuar". Fin o redirigir a Login.
   - SÍ: Mostrar botón de "Postularse".
5. **Acción**: Usuario hace clic en "Postularse".
6. **Proceso Backend**: Se registra la postulacion en la BD relacionada al Usuario.
7. **Fin**: Mostrar mensaje de éxito al usuario.

## 4. Diagrama UML: Secuencia
**Flujo de Comentario en el Foro:**
- **Actor (Usuario)** -> **Frontend (Página Forum)**: Selecciona un hilo e ingresa un comentario.
- **Frontend** -> **Frontend**: Verifica si el usuario tiene sesión activa (JWT o Estado).
  - *Si no está logueado*: **Frontend** -> **Actor**: Muestra alerta "Debe registrarse".
  - *Si está logueado*: **Frontend** -> **Backend (Express)**: POST `/api/comments` (con Token y Datos del comentario).
- **Backend (Express)** -> **Base de Datos (MongoDB)**: Inserta el registro del comentario.
- **Base de Datos** -> **Backend**: Confirma la inserción.
- **Backend** -> **Frontend**: Responde con estado 200 OK y los datos del nuevo comentario.
- **Frontend** -> **Actor**: Actualiza la interfaz mostrando el nuevo comentario en el hilo.