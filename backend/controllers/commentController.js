const commentService = require('../services/commentService');
const catchAsync = require('../utils/catchAsync');
const responseHandler = require('../utils/responseHandler');

/**
 * CONTROLADOR DE COMENTARIOS (REFACTORIZADO)
 * 
 * Punto de entrada para las peticiones HTTP relacionadas con comentarios.
 * Se ha eliminado el bloque try/catch repetitivo gracias al uso de 'catchAsync'.
 * Se utiliza 'responseHandler' para garantizar la consistencia en las respuestas.
 */

/**
 * Recupera y envía los comentarios de un foro.
 */
const getCommentsByForo = catchAsync(async (req, res) => {
  const comments = await commentService.getCommentsByForo(req.params.foroId);
  responseHandler.success(res, comments);
});

/**
 * Procesa la creación de un nuevo comentario.
 */
const createComment = catchAsync(async (req, res) => {
  const comment = await commentService.createComment(req.body);
  responseHandler.success(res, comment, 'Comentario creado con éxito', 201);
});

module.exports = {
  getCommentsByForo,
  createComment
};
