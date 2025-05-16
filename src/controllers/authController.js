const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

// Inicio de sesión
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar al usuario por nombre de usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Credenciales Incorrectas' });
        }

        // Comparar la contraseña ingresada con la contraseña encriptada almacenada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Credenciales Incorrectas' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};
// Cambio de contraseña
// En vez de obtener el ID desde req.user, lo tomas del body
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
