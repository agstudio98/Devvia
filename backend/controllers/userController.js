const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');
const responseHandler = require('../utils/responseHandler');

/**
 * CONTROLADOR DE USUARIO (REFACTORIZADO)
 * 
 * Se ha eliminado el bloque try/catch repetitivo gracias al uso de 'catchAsync'.
 * Se utiliza 'responseHandler' para garantizar que todas las respuestas tengan el mismo formato.
 */

const registerUser = catchAsync(async (req, res) => {
  const result = await userService.registerUser(req.body);
  responseHandler.success(res, result, 'Usuario registrado con éxito', 201);
});

const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.loginUser(email, password);
  responseHandler.success(res, result, 'Login exitoso');
});

const getUserProfile = catchAsync(async (req, res) => {
  const profile = await userService.getUserProfile(req.user.id);
  responseHandler.success(res, profile);
});

const updateUserProfile = catchAsync(async (req, res) => {
  const updatedProfile = await userService.updateUserProfile(req.user.id, req.body);
  responseHandler.success(res, updatedProfile, 'Perfil actualizado');
});

const updatePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const result = await userService.updatePassword(req.user.id, oldPassword, newPassword);
  responseHandler.success(res, result, 'Contraseña actualizada');
});

const toggle2FA = catchAsync(async (req, res) => {
  const updatedProfile = await userService.toggle2FA(req.user.id);
  responseHandler.success(res, updatedProfile, 'Estado 2FA cambiado');
});

const googleLogin = catchAsync(async (req, res) => {
  const { profile } = req.body;
  const result = await userService.googleLogin(profile);
  responseHandler.success(res, result, 'Login Google exitoso');
});

const ping = (req, res) => responseHandler.success(res, { status: 'ok', port: 3002 });

module.exports = { 
  registerUser, 
  loginUser, 
  ping, 
  updateUserProfile, 
  updatePassword, 
  toggle2FA, 
  googleLogin, 
  getUserProfile 
};
