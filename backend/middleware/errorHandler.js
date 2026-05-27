const responseHandler = require('../utils/responseHandler');

/**
 * MIDDLEWARE DE MANEJO DE ERRORES CENTRALIZADO (V2)
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR LOG] ${req.method} ${req.url} ->`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // 1. Errores de Multer (Carga de archivos)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return responseHandler.error(res, 'El archivo es demasiado grande (Máx 5MB)', 400);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return responseHandler.error(res, 'Demasiados archivos (Máx 20)', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return responseHandler.error(res, 'Campo de archivo no esperado', 400);
  }

  // 2. Errores de Mongoose (Validación)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return responseHandler.error(res, `Error de validación: ${messages.join(', ')}`, 400, err.errors);
  }

  // 3. Errores de Mongoose (ID inválido)
  if (err.name === 'CastError') {
    return responseHandler.error(res, 'ID de recurso no válido', 404);
  }

  // 4. Error de duplicado MongoDB
  if (err.code === 11000) {
    return responseHandler.error(res, 'Ya existe un registro con esos datos', 400);
  }

  // 5. Errores de JWT / Auth (Opcional si no se manejan en middleware)
  if (err.name === 'JsonWebTokenError') {
    return responseHandler.error(res, 'Token inválido', 401);
  }

  // 6. Error genérico o lanzado manualmente
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno del servidor';

  responseHandler.error(res, message, statusCode);
};

module.exports = errorHandler;
