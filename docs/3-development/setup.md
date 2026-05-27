# Setup y Guía de Instalación - Devvia

Sigue estos pasos para configurar el entorno de desarrollo local.

## 📋 Pre-requisitos
- **Node.js**: v18 o superior.
- **pnpm**: Recomendado para la gestión de paquetes.
- **MongoDB**: Instancia local corriendo en el puerto **27018**.

## 🚀 Instalación

### 1. Clonar el repositorio y Backend
```bash
cd backend
pnpm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en `/backend`:
```env
PORT=3002
MONGO_URI=mongodb://127.0.0.1:27018/Devvia
JWT_SECRET=tu_secreto_aqui
```

### 3. Iniciar MongoDB (Linux/Arch)
Si no tienes el servicio activo:
```bash
mkdir -p ~/mongodb_data
mongod --port 27018 --dbpath ~/mongodb_data --fork --logpath ~/mongodb.log
```

### 4. Frontend
```bash
cd ../frontend/Devvia
pnpm install
```

## 🛠 Comandos Útiles

### Ejecución
- **Backend**: `pnpm run dev` (Inicia en http://localhost:3002)
- **Frontend**: `pnpm run dev` (Inicia en http://localhost:5173)

### Pruebas
- **Backend (Jest)**: `pnpm run test:ci`
- **Frontend (Vitest)**: `pnpm run test:run`

### Linting
- `pnpm run lint`
