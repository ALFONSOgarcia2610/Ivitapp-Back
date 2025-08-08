const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Invitado = require('../models/invitadoModel'); // tu modelo Invitado
// Registro de usuario
exports.register = async (req, res) => {
  try {
    const {
      username,
      password,
      correo,
      nombre,
      apellido,
      provincia,
      canton,
      telefono,
      fechaNacimiento,
      aceptoTerminos
    } = req.body;

    // Validación campo por campo con mensajes claros
    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'El campo "username" es obligatorio.' });
    }
    if (!password || password.length < 3) {
      return res.status(400).json({ message: 'El campo "password" es obligatorio y debe tener al menos 3 caracteres.' });
    }
    if (!correo || correo.trim() === '') {
      return res.status(400).json({ message: 'El campo "correo" es obligatorio.' });
    }

    // Verificar si el usuario ya existe por username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Verificar si el correo ya está registrado
    const existingEmail = await User.findOne({ correo });
    if (existingEmail) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = new User({
      username,
      password: hashedPassword,
      correo,
      nombre: nombre?.trim() || 'Su nombre',
      apellido: apellido?.trim() || 'Su Apellido',
      provincia: provincia?.trim() || 'Su Provincia',
      canton: canton?.trim() || 'Su Canton',
      telefono: {
        prefijo: telefono?.prefijo || '+593',
        numero: telefono?.numero || ''
      },
      fechaNacimiento: fechaNacimiento || null,
      aceptoTerminos: Boolean(aceptoTerminos)
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};



// Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Credenciales Incorrectas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales Incorrectas' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 🔧 Aquí retornas los datos necesarios para el frontend
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      provincia: user.provincia || '',
      canton: user.canton || '',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};
// Cambio de contraseña
exports.changePassword = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Falta el nombre de usuario" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "La contraseña actual es incorrecta" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar la contraseña", error });
  }
};
exports.edituser = async (req, res) => {
  try {
    const { username, currentPassword, newNombre, newApellido, newProvincia, newCanton } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Falta el nombre de usuario" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "La contraseña actual es incorrecta" });
    }

    const hashedNewNombre = await (newNombre);
    user.nombre = hashedNewNombre;
    await user.save();

    const hashedNewApellido = await (newApellido);
    user.apellido = hashedNewApellido;
    await user.save();

    const hashedNewProvincia = await (newProvincia);
    user.provincia = hashedNewProvincia;
    await user.save();

    const hashedNewCanton = await (newCanton);
    user.canton = hashedNewCanton;
    await user.save();

    res.status(200).json({ message: "Datos actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar los Datos", error });
  }
};

const Invitacion = require('../models/invitacionModel');

exports.guardarInvitado = async (req, res) => {
  try {
    const {
      username,
      nombre,
      apellido,
      mesa,
      admision,
      telefono,
    } = req.body;

    console.log('Datos recibidos en guardarInvitado:', req.body);

    if (!username || !nombre || !apellido || !telefono?.numero) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const nuevoInvitado = new Invitado({
      usuario: user._id,
      nombre,
      apellido,
      mesa,
      admision,
      telefono: {
        prefijo: telefono.prefijo || '+593',
        numero: telefono.numero,
      }
    });

    await nuevoInvitado.save();

    const nuevaInvitacion = new Invitacion({
      invitado: nuevoInvitado._id,
      mensajePersonalizado: `Hola ${nombre}, estás cordialmente invitado/a al evento.`,
      fechaEvento: new Date('2025-10-05T00:00:00Z'),
      lugar: 'Lugar por definir',
      musica: '',
      enlace: `https://tuapp.com/invitacion/${nuevoInvitado._id}`,
    });

    await nuevaInvitacion.save();

    res.status(201).json({
      message: 'Invitado e invitación creados exitosamente',
      invitado: nuevoInvitado,
      invitacion: nuevaInvitacion,
    });

  } catch (error) {
    console.error('Error en guardarInvitado:', error);
    // Log completo con stack para saber origen exacto
    console.error(error.stack);
    res.status(500).json({ message: 'Error en el servidor', error: error.message || error.toString() });
  }
};

const mongoose = require('mongoose');

exports.obtenerInvitacionPorInvitado = async (req, res) => {
  try {
    const { id } = req.params;  // id del invitado
    console.log('ID recibido (invitado):', id);

    const invitadoId = mongoose.Types.ObjectId(id);

    const invitacion = await Invitacion.findOne({ invitado: invitadoId }).populate('invitado');

    console.log('Invitación encontrada:', invitacion);

    if (!invitacion) return res.status(404).json({ message: 'Invitación no encontrada' });

    res.status(200).json(invitacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};



exports.obtenerInvitadosPorUsuario = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Falta el nombre de usuario' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const invitados = await Invitado.find({ usuario: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ message: 'Invitados encontrados', invitados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

exports.guardarInvitacion = async (req, res) => {
  try {
    const { invitadoId, mensajePersonalizado, fechaEvento, lugar, enlace, musica } = req.body;
    const invitado = await Invitado.findById(invitadoId);
    if (!invitado) return res.status(404).json({ message: 'Invitado no encontrado' });

    const nuevaInvitacion = new Invitacion({
      invitado: invitado._id,
      mensajePersonalizado,
      fechaEvento,
      lugar,
      enlace,
      musica,
    });

    await nuevaInvitacion.save();
    res.status(201).json({ message: 'Invitación guardada', invitacion: nuevaInvitacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

exports.editarInvitado = async (req, res) => {
  try {
    const { idInvitado, nombre, apellido, mesa, admision, telefono, estado } = req.body;

    if (!idInvitado) {
      return res.status(400).json({ message: 'Falta el ID del invitado' });
    }

    const invitado = await Invitado.findById(idInvitado);
    if (!invitado) {
      return res.status(404).json({ message: 'Invitado no encontrado' });
    }

    // Actualizar solo si los campos fueron proporcionados
    if (estado !== undefined) invitado.estado = estado;
    if (nombre !== undefined) invitado.nombre = nombre;
    if (apellido !== undefined) invitado.apellido = apellido;
    if (mesa !== undefined) invitado.mesa = mesa;
    if (admision !== undefined) invitado.admision = admision;
    if (telefono?.numero) {
      invitado.telefono.numero = telefono.numero;
      invitado.telefono.prefijo = telefono.prefijo || '+593';
    }
    await invitado.save();
    res.status(200).json({ message: 'Invitado actualizado exitosamente', invitado });
  } catch (error) {
    console.error('Error al editar invitado:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

