const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Project = require('../models/Project');
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

describe('Projects API - Management', () => {
  let user, token, project;

  beforeEach(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});

    // 1. Crear usuario de prueba
    user = await User.create({
      nombre: 'Project Owner',
      email: 'owner@test.com',
      password: 'password123'
    });
    token = jwt.sign({ id: user._id }, JWT_SECRET);

    // 2. Crear un proyecto de prueba
    project = await Project.create({
      nombre: 'Original-Project',
      descripcion: 'Original Description',
      lenguaje: 'TypeScript',
      usuario: user._id,
      tags: ['original'],
      archivos: [{ nombre: 'index.ts', contenido: 'console.log("hello");' }]
    });
  });

  test('PUT /api/v1/projects/:id - Should update project metadata', async () => {
    const updatedData = {
      nombre: 'Updated-Name',
      descripcion: 'New description for the project',
      tags: ['updated', 'new-tag']
    };

    const res = await request(app)
      .put(`/api/v1/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nombre).toBe(updatedData.nombre);
    expect(res.body.data.descripcion).toBe(updatedData.descripcion);

    const dbProject = await Project.findById(project._id);
    expect(dbProject.nombre).toBe(updatedData.nombre);
  });

  test('DELETE /api/v1/projects/:id - Should delete project', async () => {
    const res = await request(app)
      .delete(`/api/v1/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const dbProject = await Project.findById(project._id);
    expect(dbProject).toBeNull();
  });

  test('Should NOT allow deleting others projects', async () => {
    const otherUser = await User.create({
      nombre: 'Malicious User',
      email: 'hacker@test.com',
      password: 'password123'
    });
    const otherToken = jwt.sign({ id: otherUser._id }, JWT_SECRET);

    const res = await request(app)
      .delete(`/api/v1/projects/${project._id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });
});
