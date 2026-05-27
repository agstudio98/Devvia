const supportService = require('../services/supportService');
const catchAsync = require('../utils/catchAsync');
const responseHandler = require('../utils/responseHandler');

/**
 * CONTROLADOR DE SOPORTE (REDISEÑO)
 * 
 * Gestiona la interacción del usuario con el bot de asistencia.
 * Se ha eliminado todo lo relacionado con el historial de sesiones.
 */

/**
 * Procesa un mensaje de chat y devuelve una respuesta automatizada.
 */
const chatWithBot = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const result = await supportService.processChatTurn(userId, req.body);
  responseHandler.success(res, result);
});

module.exports = { 
  chatWithBot
};
