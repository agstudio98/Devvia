const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedDatabase = require('./utils/seeder');
const v1Router = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const responseHandler = require('./utils/responseHandler');

/**
 * CONFIGURACIÓN CENTRAL DEL SERVIDOR
 * 
 * Este archivo ha sido refactorizado para soportar versionado de API (v1),
 * manejo de errores centralizado y una estructura más limpia y profesional.
 */

dotenv.config();

// Inicialización de la Base de Datos y Seeding Automático
const initDB = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    console.log('Sistema de datos listo.');
    await seedDatabase();
  } else {
    console.log('El servidor continuará corriendo en modo degradado (sin DB).');
  }
};

if (process.env.NODE_ENV !== 'test') {
  initDB();
}

const app = express();

// Middlewares Base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Para desarrollo)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

/**
 * ENRUTAMIENTO VERSIONADO
 * 
 * Se montan todas las rutas bajo /api/v1 para permitir futuras evoluciones
 * de la API sin romper la compatibilidad con versiones anteriores.
 */
app.use('/api/v1', v1Router);

// Soporte para rutas antiguas (Compatibilidad Legacy)
app.use('/api', v1Router);

/**
 * MANEJO DE RUTAS NO ENCONTRADAS (404)
 */
app.use((req, res) => {
  const fullUrl = `${req.method} ${req.url}`;
  responseHandler.error(res, `La ruta ${fullUrl} no existe en este servidor`, 404);
});

/**
 * MIDDLEWARE DE ERROR GLOBAL
 * 
 * Captura todos los errores de la aplicación y garantiza una respuesta prolija.
 */
app.use(errorHandler);

module.exports = app;
