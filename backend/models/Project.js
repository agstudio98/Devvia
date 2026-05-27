const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  tags: [{ type: String }],
  lenguaje: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  archivos: [{
    nombre: { type: String, required: true },
    contenido: { type: String, required: true },
    ruta: { type: String, default: '' },
    mimetype: { type: String },
    size: { type: Number, default: 0 }
  }],
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  publico: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
