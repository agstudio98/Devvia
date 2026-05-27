const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  ping, 
  updateUserProfile, 
  updatePassword, 
  toggle2FA, 
  googleLogin,
  getUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

/**
 * RUTAS DE USUARIO
 * 
 * Gestiona el ciclo de vida del usuario: Registro, Autenticación y Perfil.
 * Utiliza el middleware 'protect' para asegurar los endpoints privados.
 */

// --- RUTAS PÚBLICAS ---

/**
 * @route   POST /api/v1/users/register
 * @desc    Registra un nuevo usuario en la plataforma.
 * @access  Público
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/v1/users/login
 * @desc    Autentica al usuario y devuelve un token JWT.
 * @access  Público
 */
router.post('/login', loginUser);

/**
 * @route   POST /api/v1/users/google-login
 * @desc    Maneja el inicio de sesión o registro vía Google OAuth.
 * @access  Público
 */
router.post('/google-login', googleLogin);

/**
 * @route   GET /api/v1/users/ping
 * @desc    Verifica el estado del servicio y el puerto del servidor.
 * @access  Público
 */
router.get('/ping', ping);


// --- RUTAS PRIVADAS (Requieren Token JWT) ---

/**
 * @route   GET /api/v1/users/profile
 * @desc    Obtiene los datos del perfil del usuario autenticado.
 * @access  Privado
 */
router.get('/profile', protect, getUserProfile);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Actualiza la información del perfil (nombre, tecnologías, avatar).
 * @access  Privado
 */
router.put('/profile', protect, updateUserProfile);

/**
 * @route   PUT /api/v1/users/password
 * @desc    Permite al usuario cambiar su contraseña actual.
 * @access  Privado
 */
router.put('/password', protect, updatePassword);

/**
 * @route   POST /api/v1/users/2fa
 * @desc    Activa o desactiva la Autenticación de Dos Factores (2FA).
 * @access  Privado
 */
router.post('/2fa', protect, toggle2FA);

module.exports = router;
