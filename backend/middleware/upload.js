const multer = require('multer');

/**
 * CONFIGURACIÓN DE MULTER
 * Almacenamos los archivos en memoria temporalmente para procesar su contenido
 * y guardarlo en la base de datos (MongoDB).
 */
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB por archivo
    files: 20 // Máximo 20 archivos por proyecto
  }
});

module.exports = upload;
