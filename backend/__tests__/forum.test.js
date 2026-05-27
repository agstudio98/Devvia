const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');

let mongoServer;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Aumentamos el tiempo de espera para el inicio de MongoDB Memory Server
jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Forum API - Comments Edition and Deletion', () => {
  let user, token, post, comment;

  beforeEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // 1. Crear usuario de prueba
    user = await User.create({
      nombre: 'Test User',
      email: 'test@test.com',
      password: 'password123'
    });
    token = jwt.sign({ id: user._id }, JWT_SECRET);

    // 2. Crear un post de prueba
    post = await Post.create({
      title: 'Test Post',
      content: 'Test Content Content Content',
      author: user._id,
      authorName: user.nombre,
      tags: ['test']
    });

    // 3. Crear un comentario de prueba
    comment = await Comment.create({
      post: post._id,
      user: user._id,
      authorName: user.nombre,
      text: 'Original Comment'
    });
  });

  test('PUT /api/v1/forum/comment/:id - Should update comment', async () => {
    const updatedText = 'Updated Comment Content';
    const res = await request(app)
      .put(`/api/v1/forum/comment/${comment._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: updatedText });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.text).toBe(updatedText);

    const dbComment = await Comment.findById(comment._id);
    expect(dbComment.text).toBe(updatedText);
  });

  test('DELETE /api/v1/forum/comment/:id - Should delete comment', async () => {
    const res = await request(app)
      .delete(`/api/v1/forum/comment/${comment._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const dbComment = await Comment.findById(comment._id);
    expect(dbComment).toBeNull();
  });

  test('Should NOT allow deleting others comments', async () => {
    const otherUser = await User.create({
      nombre: 'Other User',
      email: 'other@test.com',
      password: 'password123'
    });
    const otherToken = jwt.sign({ id: otherUser._id }, JWT_SECRET);

    const res = await request(app)
      .delete(`/api/v1/forum/comment/${comment._id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403); // O el error que hayamos definido, reviso forumService
    // En forumService lanzamos Error('No tienes permiso...'), catchAsync lo pasa al errorHandler
  });
});
