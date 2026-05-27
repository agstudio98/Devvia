const forumService = require('../services/forumService');
const catchAsync = require('../utils/catchAsync');
const responseHandler = require('../utils/responseHandler');

/**
 * CONTROLADOR DE FORO (REFACTORIZADO)
 * 
 * Gestiona los puntos de entrada HTTP para las operaciones del foro.
 */

/**
 * Obtiene todas las publicaciones disponibles.
 */
const getPosts = catchAsync(async (req, res) => {
  const posts = await forumService.getAllPosts();
  responseHandler.success(res, posts);
});

/**
 * Obtiene los detalles de una publicación específica junto con sus comentarios.
 */
const getPostDetails = catchAsync(async (req, res) => {
  const result = await forumService.getPostDetails(req.params.id);
  responseHandler.success(res, result);
});

/**
 * Crea una nueva publicación.
 */
const createPost = catchAsync(async (req, res) => {
  const post = await forumService.createPost(req.user.id, req.body);
  responseHandler.success(res, post, 'Publicación creada con éxito', 201);
});

/**
 * Actualiza una publicación existente.
 */
const updatePost = catchAsync(async (req, res) => {
  const post = await forumService.updatePost(req.user.id, req.params.id, req.body);
  responseHandler.success(res, post, 'Publicación actualizada con éxito');
});

/**
 * Elimina una publicación.
 */
const deletePost = catchAsync(async (req, res) => {
  const result = await forumService.deletePost(req.user.id, req.params.id);
  responseHandler.success(res, result, 'Publicación eliminada con éxito');
});

/**
 * Agrega un nuevo comentario a una publicación.
 */
const addComment = catchAsync(async (req, res) => {
  const newComment = await forumService.addComment(req.user.id, req.body);
  responseHandler.success(res, newComment, 'Comentario agregado con éxito', 201);
});

/**
 * Actualiza un comentario existente.
 */
const updateComment = catchAsync(async (req, res) => {
  const updatedComment = await forumService.updateComment(req.user.id, req.params.id, req.body.text);
  responseHandler.success(res, updatedComment, 'Comentario actualizado con éxito');
});

/**
 * Elimina un comentario.
 */
const deleteComment = catchAsync(async (req, res) => {
  const result = await forumService.deleteComment(req.user.id, req.params.id);
  responseHandler.success(res, result, 'Comentario eliminado con éxito');
});

/**
 * Permite a un usuario calificar una publicación (Sistema de estrellas).
 */
const ratePost = catchAsync(async (req, res) => {
  const { stars } = req.body;
  const result = await forumService.ratePost(req.user.id, req.params.id, stars);
  responseHandler.success(res, result, 'Calificación guardada con éxito');
});

module.exports = { 
  getPosts, 
  getPostDetails, 
  createPost,
  updatePost,
  deletePost,
  addComment, 
  updateComment,
  deleteComment,
  ratePost 
};
