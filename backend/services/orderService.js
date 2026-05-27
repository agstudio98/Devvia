const Order = require('../models/Order');

/**
 * SERVICIO DE ÓRDENES / POSTULACIONES
 * 
 * Gestiona la lógica de negocio para las postulaciones a empleos (Orders).
 * Aplica SRP al separar la persistencia y reglas de negocio del manejo de HTTP.
 */

/**
 * Crea una nueva postulación a un empleo.
 * @param {Object} orderData - Datos de la postulación (empleoId, puesto, empresa).
 * @param {string} userId - ID del usuario que se postula.
 * @throws {Error} Si el usuario ya se ha postulado anteriormente.
 * @returns {Promise<Object>} La postulación creada.
 */
const applyToJob = async (orderData, userId) => {
  const { empleoId, puesto, empresa } = orderData;
  
  // Regla de negocio: Verificar si ya existe una postulación previa
  const existing = await Order.findOne({ empleoId, usuario: userId });
  if (existing) {
    throw new Error('Ya te has postulado a este empleo');
  }

  return await Order.create({ 
    empleoId, 
    usuario: userId,
    puesto,
    empresa
  });
};

/**
 * Obtiene las postulaciones del usuario autenticado.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<Array>} Lista de postulaciones ordenadas por fecha.
 */
const getUserOrders = async (userId) => {
  return await Order.find({ usuario: userId }).sort({ createdAt: -1 });
};

/**
 * Obtiene todas las postulaciones del sistema (Admin).
 * @returns {Promise<Array>} Lista de todas las postulaciones con datos del usuario.
 */
const getAllOrders = async () => {
  return await Order.find().populate('usuario', 'nombre email');
};

/**
 * Elimina una postulación específica.
 * @param {string} orderId - ID de la postulación.
 * @param {string} userId - ID del usuario solicitante (para verificación de autoría).
 * @throws {Error} Si no existe o no tiene permisos.
 */
const deleteOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new Error('Postulación no encontrada');
  }
  
  // Verificación de autoría (Propiedad del recurso)
  if (order.usuario.toString() !== userId) {
    throw new Error('No autorizado para eliminar esta postulación');
  }

  return await Order.findByIdAndDelete(orderId);
};

module.exports = {
  applyToJob,
  getUserOrders,
  getAllOrders,
  deleteOrder
};
