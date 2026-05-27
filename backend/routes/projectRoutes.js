const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  getProjectDetails, 
  createProject, 
  updateProject,
  deleteProject,
  downloadProject 
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * RUTAS DE CATÁLOGO DE PROYECTOS (V3)
 * 
 * Orquestación de acceso público y privado para repositorios.
 */

// --- RUTAS DE GESTIÓN (Prioridad para evitar conflictos con /:id) ---
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

// --- RUTAS DE CONSULTA ---
router.get('/', getProjects);
router.get('/:id', getProjectDetails);
router.get('/:id/download', downloadProject);

/**
 * POST /api/v1/projects
 * Middleware 'upload.array' permite subir hasta 20 archivos simultáneos.
 */
router.post('/', protect, upload.array('files', 20), createProject);

module.exports = router;
