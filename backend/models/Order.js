const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  empleoId: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  puesto: { type: String },
  empresa: { type: String },
  estado: { type: String, default: 'Enviada' },
  fecha: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);