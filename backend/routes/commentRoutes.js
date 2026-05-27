const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

/**
 * RUTAS DE COMENTARIOS
 * 
 * Gestiona los comentarios asociados a las publicaciones del foro.
 * Permite la recuperación por foro y la creación de nuevos aportes.
 */

// --- RUTAS PÚBLICAS ---

/**
 * @route   GET /api/v1/comments/:foroId
 * @desc    Obtiene todos los comentarios pertenecientes a un post de foro específico.
 * @access  Público
 */
router.get('/:foroId', commentController.getCommentsByForo);

/**
 * @route   POST /api/v1/comments
 * @desc    Crea un nuevo comentario en una publicación.
 * @access  Público
 */
router.post('/', commentController.createComment);

module.exports = router;
