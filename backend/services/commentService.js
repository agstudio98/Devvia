const Comment = require('../models/Comment');

/**
 * SERVICIO DE COMENTARIOS
 * 
 * Se encarga de la lógica de negocio para los comentarios de los foros.
 * Al aplicar SRP, este servicio aísla la lógica de persistencia de Mongoose.
 */

/**
 * Obtiene todos los comentarios asociados a un foro específico.
 * @param {string} foroId - ID del foro.
 * @returns {Promise<Array>} Lista de comentarios con información del autor.
 */
const getCommentsByForo = async (foroId) => {
  return await Comment.find({ foroId }).populate('usuario', 'nombre avatar');
};

/**
 * Crea un nuevo comentario.
 * @param {Object} commentData - Datos del comentario (contenido, foroId, usuario).
 * @returns {Promise<Object>} Comentario creado.
 */
const createComment = async (commentData) => {
  const { contenido, foroId, usuario } = commentData;
  
  if (!contenido || contenido.trim() === '') {
    throw new Error('El contenido del comentario es obligatorio');
  }

  return await Comment.create({ contenido, foroId, usuario });
};

module.exports = {
  getCommentsByForo,
  createComment
};
