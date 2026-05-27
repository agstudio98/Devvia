const express = require('express');
const router = express.Router();
const { chatWithBot } = require('../controllers/supportController');
const { protect } = require('../middleware/auth');

/**
 * RUTAS DE SOPORTE (REDISEÑO)
 * 
 * Gestiona el sistema de soporte (Chatbot por Etiquetas).
 * Se ha eliminado todo lo relacionado con el historial de sesiones.
 */

// --- RUTAS PRIVADAS (Requieren Token JWT) ---

/**
 * @route   POST /api/v1/support/chat
 * @desc    Interacción con el asistente de Devvia.
 * @access  Privado
 */
router.post('/chat', protect, chatWithBot);

module.exports = router;
