// models/invitacionModel.js
const mongoose = require('mongoose');

const invitacionSchema = new mongoose.Schema({
  invitado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invitado',
    required: true,
    unique: true, // Cada invitado solo puede tener una invitación
  },
  mensajePersonalizado: {
    type: String,
    trim: true,
  },
  fechaEvento: {
    type: Date,
    required: true,
     default: new Date('2025-10-05T00:00:00Z') 
  },
  lugar: {
    type: String,
    required: true,
    trim: true,
  },
  enlace: {
    type: String,
    trim: true,
  },
  musica: {
    type: String, // puede ser URL a una canción o playlist
    trim: true,
  },
  confirmacionAsistencia: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Invitacion = mongoose.model('Invitacion', invitacionSchema);
module.exports = Invitacion;
