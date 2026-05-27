const Post = require('../models/Post');
const Comment = require('../models/Comment');

/**
 * SERVICIO DE FORO (REFINADO)
 * 
 * Gestiona la lógica de las publicaciones con un enfoque en la robustez
 * para evitar fallos en el frontend.
 */

const getAllPosts = async () => {
  const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'nombre avatar');
  return posts || [];
};

const getPostDetails = async (postId) => {
  const post = await Post.findById(postId).populate('author', 'nombre avatar');
  if (!post) {
    throw new Error('Post not found');
  }
  
  const comments = await Comment.find({ post: postId }).sort({ createdAt: 1 }).populate('user', 'nombre avatar');
  return { post, comments: comments || [] };
};

const createPost = async (userId, postData) => {
  const post = await Post.create({
    ...postData,
    author: userId
  });
  return post;
};

const updatePost = async (userId, postId, postData) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  if (post.author.toString() !== userId) {
    const error = new Error('No tienes permiso para editar este post');
    error.statusCode = 403;
    throw error;
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
    new: true,
    runValidators: true
  });

  return updatedPost;
};

const deletePost = async (userId, postId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  if (post.author.toString() !== userId) {
    const error = new Error('No tienes permiso para eliminar este post');
    error.statusCode = 403;
    throw error;
  }

  await Post.findByIdAndDelete(postId);
  await Comment.deleteMany({ post: postId });
  
  return { id: postId };
};

const addComment = async (userId, { postId, text, authorName, avatar }) => {
  if (!text || !postId) {
    throw new Error('Contenido y ID de post son requeridos');
  }

  const comment = await Comment.create({
    post: postId,
    user: userId,
    authorName,
    text,
    avatar
  });
  
  return comment;
};

const updateComment = async (userId, commentId, text) => {
  if (!text) {
    throw new Error('El contenido del comentario es requerido');
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error('Comentario no encontrado');
  }

  if (comment.user.toString() !== userId) {
    const error = new Error('No tienes permiso para editar este comentario');
    error.statusCode = 403;
    throw error;
  }

  comment.text = text;
  await comment.save();
  return comment;
};

const deleteComment = async (userId, commentId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error('Comentario no encontrado');
  }

  if (comment.user.toString() !== userId) {
    const error = new Error('No tienes permiso para eliminar este comentario');
    error.statusCode = 403;
    throw error;
  }

  await Comment.findByIdAndDelete(commentId);
  return { id: commentId };
};

const ratePost = async (userId, postId, stars) => {
  if (stars < 1 || stars > 5) {
    throw new Error('La calificación debe estar entre 1 y 5');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  post.ratings = post.ratings.filter(r => r.user.toString() !== userId);
  post.ratings.push({ user: userId, stars });
  
  const sum = post.ratings.reduce((acc, r) => acc + r.stars, 0);
  post.averageRating = sum / post.ratings.length;

  await post.save();
  return { averageRating: post.averageRating };
};

module.exports = {
  getAllPosts,
  getPostDetails,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  ratePost
};
