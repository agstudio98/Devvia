const mongoose = require('mongoose');

/**
 * MODELO DE EMPLEO (JOB)
 * 
 * Representa una oferta laboral en la plataforma.
 * Incluye detalles sobre la empresa, salario, ubicación y etiquetas técnicas
 * para calcular el match con el usuario.
 */
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
  type: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract'], 
    default: 'Full-time' 
  },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
