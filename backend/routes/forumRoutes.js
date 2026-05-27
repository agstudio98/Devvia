const express = require('express');
const router = express.Router();
const { 
  getPosts, 
  getPostDetails, 
  createPost,
  updatePost,
  deletePost,
  addComment, 
  updateComment,
  deleteComment,
  ratePost 
} = require('../controllers/forumController');
const { protect } = require('../middleware/auth');

/**
 * RUTAS DEL FORO (COMUNIDAD)
 * 
 * Gestiona la interacción entre desarrolladores en el foro: visualización de posts,
 * detalles específicos, comentarios y valoraciones de contenido.
 */

// --- RUTAS PÚBLICAS ---

/**
 * @route   GET /api/v1/forum
 * @desc    Obtiene una lista de todos los posts en el foro (soporta filtros).
 * @access  Público
 */
router.get('/', getPosts);

/**
 * @route   GET /api/v1/forum/:id
 * @desc    Obtiene los detalles completos de un post específico por su ID.
 * @access  Público
 */
router.get('/:id', getPostDetails);


// --- RUTAS PRIVADAS (Requieren Token JWT) ---

/**
 * @route   POST /api/v1/forum
 * @desc    Crea un nuevo post en el foro.
 * @access  Privado
 */
router.post('/', protect, createPost);

/**
 * @route   PUT /api/v1/forum/:id
 * @desc    Actualiza un post existente.
 * @access  Privado
 */
router.put('/:id', protect, updatePost);

/**
 * @route   DELETE /api/v1/forum/:id
 * @desc    Elimina un post y sus comentarios.
 * @access  Privado
 */
router.delete('/:id', protect, deletePost);

/**
 * @route   POST /api/v1/forum/comment
 * @desc    Agrega un nuevo comentario a un post existente.
 * @access  Privado
 */
router.post('/comment', protect, addComment);

/**
 * @route   PUT /api/v1/forum/comment/:id
 * @desc    Actualiza un comentario existente.
 * @access  Privado
 */
router.put('/comment/:id', protect, updateComment);

/**
 * @route   DELETE /api/v1/forum/comment/:id
 * @desc    Elimina un comentario.
 * @access  Privado
 */
router.delete('/comment/:id', protect, deleteComment);

/**
 * @route   POST /api/v1/forum/rate/:id
 * @desc    Permite a un usuario calificar (dar like/votar) un post.
 * @access  Privado
 */
router.post('/rate/:id', protect, ratePost);

module.exports = router;
