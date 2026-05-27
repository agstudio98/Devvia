const Project = require('../models/Project');
const JSZip = require('jszip');

/**
 * EXTENSIONES PERMITIDAS
 */
const ALLOWED_EXTENSIONS = [
  'js', 'jsx', 'ts', 'tsx', 'py', 'go', 'rs', 'c', 'cpp', 'h', 'hpp', 
  'java', 'html', 'css', 'scss', 'json', 'md', 'yml', 'yaml', 'sh', 'sql'
];

const isValidExtension = (fileName) => {
  if (!fileName) return false;
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
};

/**
 * Helper para lanzar errores con status code
 */
const throwError = (message, status = 400) => {
  const error = new Error(message);
  error.statusCode = status;
  throw error;
};

/**
 * SERVICIO DE PROYECTO (V8 - DEFENSIVO)
 */

const getAllPublicProjects = async () => {
  return await Project.find({ publico: true })
    .populate('usuario', '_id nombre avatar')
    .sort({ createdAt: -1 });
};

const getProjectById = async (projectId) => {
  const project = await Project.findById(projectId).populate('usuario', '_id nombre avatar');
  if (!project) throwError('Repositorio no encontrado', 404);
  return project;
};

const createProject = async (projectData, userId, files = []) => {
  // Verificación defensiva contra req.body undefined
  if (!projectData) {
    console.error('[CRITICAL] No se recibieron datos en projectData (req.body)');
    throwError('No se recibieron los metadatos del proyecto. Verifica el formato de envío.', 400);
  }

  const { nombre, descripcion, tags, lenguaje, manualFiles, publico } = projectData;

  console.log('[CREATE PROJECT] Datos recibidos:', { nombre, userId, filesCount: files?.length });

  // 1. Validaciones de Campos Base
  if (!nombre || !nombre.trim()) throwError('El nombre del repositorio es obligatorio.');
  if (!descripcion || !descripcion.trim()) throwError('La descripción es obligatoria.');
  if (!userId) throwError('No se pudo identificar al usuario autenticado.', 401);

  const processedFiles = [];

  // 2. Procesar Archivos Físicos (Multer)
  if (files && Array.isArray(files) && files.length > 0) {
    files.forEach(file => {
      if (!isValidExtension(file.originalname)) {
        throwError(`Archivo no permitido: ${file.originalname}`);
      }
      processedFiles.push({
        nombre: file.originalname,
        contenido: file.buffer ? file.buffer.toString('utf8') : '',
        mimetype: file.mimetype || 'text/plain',
        size: file.size || 0,
        ruta: ''
      });
    });
  }

  // 3. Procesar Archivos Manuales (JSON)
  if (manualFiles) {
    try {
      const parsedManual = typeof manualFiles === 'string' ? JSON.parse(manualFiles) : manualFiles;
      if (Array.isArray(parsedManual)) {
        parsedManual.forEach(f => {
          if (!f.nombre || !isValidExtension(f.nombre)) {
            throwError(`Extensión no válida en archivo manual: ${f.nombre || 'Sin nombre'}`);
          }
          processedFiles.push({
            nombre: f.nombre,
            contenido: f.contenido || '',
            mimetype: 'text/plain',
            size: Buffer.byteLength(f.contenido || '', 'utf8'),
            ruta: f.ruta || ''
          });
        });
      }
    } catch (e) {
      if (e.statusCode) throw e;
      throwError('Error al procesar los archivos manuales.');
    }
  }

  if (processedFiles.length === 0) {
    throwError('Debes incluir al menos un archivo de código válido.');
  }

  // 4. Procesar Tags
  let tagsArray = [];
  if (tags) {
    try {
      tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags);
    } catch (e) {
      tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [];
    }
  }

  // 5. Persistencia en BD
  try {
    const newProject = await Project.create({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      tags: tagsArray,
      lenguaje: lenguaje || 'Plain Text',
      archivos: processedFiles,
      publico: String(publico) === 'true',
      usuario: userId
    });
    return await Project.findById(newProject._id).populate('usuario', '_id nombre avatar');
  } catch (dbErr) {
    console.error('[DB ERROR]', dbErr.message);
    if (dbErr.name === 'ValidationError') throw dbErr;
    throwError('Error al guardar en la base de datos.', 500);
  }
};

const updateProject = async (projectId, userId, projectData) => {
  const project = await Project.findById(projectId);
  if (!project) throwError('Repositorio no encontrado', 404);

  if (project.usuario.toString() !== userId) {
    throwError('No tienes permiso para editar este repositorio', 403);
  }

  const { nombre, descripcion, tags, lenguaje, publico } = projectData;

  if (nombre) project.nombre = nombre.trim();
  if (descripcion) project.descripcion = descripcion.trim();
  if (lenguaje) project.lenguaje = lenguaje;
  if (publico !== undefined) project.publico = String(publico) === 'true';
  
  if (tags) {
    try {
      project.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
    } catch (e) {
      project.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : project.tags;
    }
  }

  await project.save();
  return await Project.findById(project._id).populate('usuario', '_id nombre avatar');
};

const deleteProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throwError('Repositorio no encontrado', 404);

  if (project.usuario.toString() !== userId) {
    throwError('No tienes permiso para eliminar este repositorio', 403);
  }

  await Project.findByIdAndDelete(projectId);
  return { id: projectId };
};

const generateProjectZip = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) throwError('Repositorio no encontrado', 404);

  const zip = new JSZip();
  project.archivos.forEach(file => {
    const filePath = file.ruta ? `${file.ruta}/${file.nombre}` : file.nombre;
    zip.file(filePath, file.contenido || '');
  });

  const buffer = await zip.generateAsync({ type: 'nodebuffer' });
  return { buffer, filename: `${project.nombre.replace(/\s+/g, '-')}-devvia.zip` };
};

module.exports = {
  getAllPublicProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  generateProjectZip
};
