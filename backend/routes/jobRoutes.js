const express = require('express');
const router = express.Router();
const { getJobs, getJobDetails } = require('../controllers/jobController');

/**
 * RUTAS DE EMPLEOS
 */

/**
 * @route   GET /api/v1/jobs
 * @desc    Obtiene todas las vacantes activas.
 * @access  Público
 */
router.get('/', getJobs);

/**
 * @route   GET /api/v1/jobs/:id
 * @desc    Obtiene el detalle de una vacante específica.
 * @access  Público
 */
router.get('/:id', getJobDetails);

module.exports = router;
