/**
 * MANEJADOR ESTÁNDAR DE RESPUESTAS
 * 
 * Este archivo centraliza la forma en que el servidor responde al cliente.
 * Siguiendo el principio de consistencia, todas las respuestas tendrán 
 * la misma estructura, facilitando el trabajo del frontend.
 */

const responseHandler = {
  /**
   * Respuesta exitosa (200 OK, 201 Created, etc.)
   */
  success: (res, data, message = 'Success', status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data
    });
  },

  /**
   * Respuesta de error (400, 404, 500, etc.)
   */
  error: (res, message = 'Internal Server Error', status = 500, errors = null) => {
    return res.status(status).json({
      success: false,
      message,
      errors
    });
  }
};

module.exports = responseHandler;
