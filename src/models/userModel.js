const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3 // mínimo recomendado
  },
  nombre: {
    type: String,
    default: 'Su nombre',
    trim: true
  },
  apellido: {
    type: String,
    default: 'Su Apellido',
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Correo inválido']
  },
  telefono: {
    prefijo: {
      type: String,
      default: '+593'
    },
    numero: {
      type: String,
      default: '',
      trim: true
    }
  },
  aceptoTerminos: {
  type: Boolean,
  required: true,
  default: false
},
  fechaNacimiento: {
    type: Date,
    default: null
  },
  provincia: {
    type: String,
    default: 'Su Provincia',
    trim: true
  },
  canton: {
    type: String,
    default: 'Su Canton',
    trim: true
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
