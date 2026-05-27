const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * RUTAS DE PRODUCTOS (VACANTES / SERVICIOS)
 * 
 * Gestiona el catálogo de productos disponibles, que en este contexto 
 * suelen representar vacantes de empleo o servicios profesionales.
 */

// --- RUTAS PÚBLICAS ---

/**
 * @route   GET /api/v1/products
 * @desc    Obtiene la lista completa de productos (vacantes) disponibles.
 * @access  Público
 */
router.get('/', productController.getAllProducts);

/**
 * @route   POST /api/v1/products
 * @desc    Registra un nuevo producto o vacante en el sistema.
 * @access  Público
 */
router.post('/', productController.createProduct);

module.exports = router;
