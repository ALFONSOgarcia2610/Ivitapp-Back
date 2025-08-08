const mongoose = require('mongoose');

const invitadoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
  },
  mesa: {
    type: String,
    trim: true,
  },
  admision: {
    type: Number,
    default: false,
  },
  telefono: {
    prefijo: { type: String, default: '+593' },
    numero: { type: String, required: false },
  },
  estado: {
    type: String,
    default: 'pendiente', // <-- NUEVO CAMPO
  }
}, { timestamps: true });

const Invitado = mongoose.model('Invitado', invitadoSchema);
module.exports = Invitado;
