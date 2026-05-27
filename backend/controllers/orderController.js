const orderService = require('../services/orderService');
const catchAsync = require('../utils/catchAsync');
const responseHandler = require('../utils/responseHandler');

/**
 * CONTROLADOR DE ÓRDENES / POSTULACIONES (REFACTORIZADO)
 * 
 * Intermediario que traduce las peticiones HTTP en llamadas al servicio de órdenes.
 * Se ha eliminado el bloque try/catch repetitivo gracias al uso de 'catchAsync'.
 */

/**
 * Procesa la postulación de un usuario a un empleo.
 */
const applyToJob = catchAsync(async (req, res) => {
  console.log('DEBUG: Solicitando empleo con cuerpo:', req.body);
  console.log('DEBUG: Usuario ID:', req.user.id);
  const result = await orderService.applyToJob(req.body, req.user.id);
  responseHandler.success(res, result, 'Postulación realizada con éxito', 201);
});

/**
 * Retorna las postulaciones del usuario actual.
 */
const getUserOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);
  responseHandler.success(res, orders);
});

/**
 * Retorna todas las postulaciones (Ruta de administración).
 */
const getAllOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders();
  responseHandler.success(res, orders);
});

/**
 * Maneja la eliminación de una postulación.
 */
const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrder(req.params.id, req.user.id);
  responseHandler.success(res, null, 'Postulación eliminada con éxito');
});

module.exports = {
  applyToJob,
  getUserOrders,
  getAllOrders,
  deleteOrder
};
