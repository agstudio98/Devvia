const express = require('express');
const router = express.Router();

// Importación de rutas de módulos
const userRoutes = require('./userRoutes');
const forumRoutes = require('./forumRoutes');
const productRoutes = require('./productRoutes');
const projectRoutes = require('./projectRoutes');
const orderRoutes = require('./orderRoutes');
const supportRoutes = require('./supportRoutes');
const commentRoutes = require('./commentRoutes');
const jobRoutes = require('./jobRoutes');

/**
 * ENRUTADOR CENTRAL DE LA API (v1)
 * 
 * Aquí se definen todas las rutas bajo la versión 1.
 * Esto permite que en el futuro puedas crear un 'indexV2.js' 
 * sin romper la compatibilidad con apps que usen v1.
 */

router.use('/users', userRoutes);
router.use('/forum', forumRoutes);
router.use('/products', productRoutes);
router.use('/projects', projectRoutes);
router.use('/orders', orderRoutes);
router.use('/support', supportRoutes);
router.use('/comments', commentRoutes);
router.use('/jobs', jobRoutes);

module.exports = router;
