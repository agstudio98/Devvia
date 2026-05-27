const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

/**
 * RUTAS DE ÓRDENES (POSTULACIONES)
 * 
 * Gestiona el ciclo de vida de las postulaciones a vacantes o proyectos (órdenes).
 * Permite a los usuarios aplicar, ver sus solicitudes y administrarlas.
 */

// --- RUTAS PRIVADAS (Requieren Token JWT) ---

/**
 * @route   POST /api/v1/orders/apply
 * @desc    Crea una nueva postulación (aplicación) a una vacante o proyecto.
 * @access  Privado
 */
router.post('/apply', protect, orderController.applyToJob);

/**
 * @route   GET /api/v1/orders/my-orders
 * @desc    Obtiene todas las postulaciones realizadas por el usuario autenticado.
 * @access  Privado
 */
router.get('/my-orders', protect, orderController.getUserOrders);

/**
 * @route   GET /api/v1/orders
 * @desc    Obtiene una lista global de todas las postulaciones (Uso administrativo).
 * @access  Privado
 */
router.get('/', protect, orderController.getAllOrders);

/**
 * @route   DELETE /api/v1/orders/:id
 * @desc    Cancela o elimina una postulación específica por su ID.
 * @access  Privado
 */
router.delete('/:id', protect, orderController.deleteOrder);

module.exports = router;
