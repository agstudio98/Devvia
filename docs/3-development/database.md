# Estructura de Base de Datos - Devvia

Devvia utiliza **MongoDB** con **Mongoose** para el modelado de datos.

## Colecciones Principales

### 👤 User
- `nombre`: String (Required)
- `apellido`: String
- `email`: String (Unique, Required)
- `password`: String (Hashed)
- `avatar`: String (URL)
- `tecnologias`: [String]
- `twoFA`: Boolean

### 📁 Project
- `nombre`: String (Required)
- `descripcion`: String (Required)
- `tags`: [String]
- `lenguaje`: String
- `usuario`: ObjectId (Ref: User)
- `archivos`: Array of { nombre, contenido, ruta, mimetype, size }
- `stars`: Number
- `publico`: Boolean

### 💬 Post (Foro)
- `title`: String (Required)
- `content`: String (Required)
- `author`: ObjectId (Ref: User)
- `tags`: [String]
- `ratings`: Array of { user, stars }
- `averageRating`: Number

### 📝 Comment
- `post`: ObjectId (Ref: Post)
- `user`: ObjectId (Ref: User)
- `authorName`: String
- `text`: String
- `avatar`: String

### 💼 Job
- `title`: String
- `company`: String
- `location`: String
- `salary`: String
- `tags`: [String]
- `type`: String
- `description`: String
