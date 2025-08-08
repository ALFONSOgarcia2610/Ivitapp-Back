const express = require('express');
const {
  register,
  login,
  changePassword,
  edituser,
  guardarInvitado,
  obtenerInvitadosPorUsuario,
  guardarInvitacion,
  obtenerInvitacionPorInvitado,
  editarInvitado,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/changePassword', changePassword);
router.post('/edituser', edituser);

router.post('/invitados', guardarInvitado);
router.post('/invitados/listar', obtenerInvitadosPorUsuario);

router.post('/invitacion', guardarInvitacion); 
router.put('/invitado/editar', editarInvitado);

router.get('/invitacion/:id', obtenerInvitacionPorInvitado); 

module.exports = router;
