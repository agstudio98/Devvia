const projectService = require('../services/projectService');
const catchAsync = require('../utils/catchAsync');
const responseHandler = require('../utils/responseHandler');

/**
 * CONTROLADOR DE PROYECTOS (V3)
 * 
 * Gestiona peticiones para el catálogo de código, incluyendo carga de archivos.
 */

const getProjects = catchAsync(async (req, res) => {
  const projects = await projectService.getAllPublicProjects();
  responseHandler.success(res, projects);
});

const getProjectDetails = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  responseHandler.success(res, project);
});

/**
 * CREAR PROYECTO
 * Soporta multipart/form-data (archivos físicos) y JSON metadata.
 */
const createProject = catchAsync(async (req, res) => {
  // Los archivos físicos vienen en req.files gracias al middleware upload
  // La metadata viene en req.body
  const newProject = await projectService.createProject(req.body, req.user.id, req.files);
  
  responseHandler.success(res, newProject, 'Repositorio creado con éxito', 201);
});

/**
 * ACTUALIZAR PROYECTO
 */
const updateProject = catchAsync(async (req, res) => {
  const updatedProject = await projectService.updateProject(req.params.id, req.user.id, req.body);
  responseHandler.success(res, updatedProject, 'Repositorio actualizado con éxito');
});

/**
 * ELIMINAR PROYECTO
 */
const deleteProject = catchAsync(async (req, res) => {
  console.log(`[DELETE PROJECT] ID: ${req.params.id} | User: ${req.user.id}`);
  const result = await projectService.deleteProject(req.params.id, req.user.id);
  responseHandler.success(res, result, 'Repositorio eliminado con éxito');
});

/**
 * DESCARGAR ZIP
 * Genera un buffer de memoria y lo envía como flujo de datos.
 */
const downloadProject = catchAsync(async (req, res) => {
  const { buffer, filename } = await projectService.generateProjectZip(req.params.id);
  
  res.set({
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename=${filename}`,
    'Content-Length': buffer.length
  });
  
  res.status(200).send(buffer);
});

module.exports = { 
  getProjects, 
  getProjectDetails, 
  createProject, 
  updateProject,
  deleteProject,
  downloadProject 
};
