const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * SERVICIO DE USUARIO
 * 
 * Este servicio se encarga de toda la lógica de negocio relacionada con los usuarios
 * y la comunicación directa con la base de datos a través del modelo Mongoose.
 * 
 * Aplicamos el principio de Responsabilidad Única (SRP) al separar la lógica
 * de los controladores (que solo deben manejar peticiones HTTP).
 */

// Secreto para JWT (debería estar en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * Formatea un objeto de usuario para enviar al cliente, eliminando datos sensibles.
 * @param {Object} user - Documento de usuario de Mongoose.
 * @returns {Object} Usuario formateado.
 */
const formatUserResponse = (user) => ({
  _id: user._id,
  nombre: user.nombre,
  apellido: user.apellido || '',
  email: user.email,
  avatar: user.avatar,
  tecnologias: user.tecnologias || [],
  twoFA: user.twoFA,
  createdAt: user.createdAt
});

/**
 * Genera un token JWT para un usuario.
 * @param {string} userId - ID del usuario.
 * @returns {string} Token firmado.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
};

/**
 * Registra un nuevo usuario en el sistema.
 * @param {Object} userData - Datos del usuario (nombre, apellido, email, password).
 * @throws {Error} Si el usuario ya existe.
 */
const registerUser = async ({ nombre, apellido, email, password }) => {
  const lowercaseEmail = email.trim().toLowerCase();
  
  // Verificamos si el email ya está registrado
  const userExists = await User.findOne({ email: lowercaseEmail });
  if (userExists) {
    throw new Error('El usuario ya existe');
  }

  // Creamos el nuevo usuario
  const user = await User.create({ 
    nombre: nombre.trim(), 
    apellido: (apellido || '').trim(), 
    email: lowercaseEmail, 
    password 
  });
  
  const token = generateToken(user._id);
  return { ...formatUserResponse(user), token };
};

/**
 * Autentica a un usuario por email y contraseña.
 * @param {string} email - Correo del usuario.
 * @param {string} password - Contraseña en texto plano.
 * @throws {Error} Si las credenciales son inválidas.
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  
  // Verificamos existencia y comparamos contraseña (usando el método del modelo)
  if (user && (await user.comparePassword(password))) {
    const token = generateToken(user._id);
    return { ...formatUserResponse(user), token };
  } else {
    throw new Error('Credenciales inválidas');
  }
};

/**
 * Obtiene el perfil de un usuario por su ID.
 * @param {string} userId - ID del usuario.
 * @throws {Error} Si el usuario no existe.
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return formatUserResponse(user);
};

/**
 * Actualiza los datos del perfil de un usuario.
 * @param {string} userId - ID del usuario.
 * @param {Object} updateData - Datos a actualizar (nombre, apellido, tecnologías, avatar).
 */
const updateUserProfile = async (userId, { nombre, apellido, tecnologias, avatar }) => {
  const data = {};
  if (nombre !== undefined) data.nombre = nombre.trim();
  if (apellido !== undefined) data.apellido = apellido.trim();
  if (tecnologias !== undefined) data.tecnologias = Array.isArray(tecnologias) ? tecnologias : [];
  if (avatar !== undefined) data.avatar = avatar;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { returnDocument: 'after', runValidators: true }
  );
  
  if (!updatedUser) {
    throw new Error('Usuario no encontrado');
  }
  return formatUserResponse(updatedUser);
};

/**
 * Cambia la contraseña de un usuario.
 * @param {string} userId - ID del usuario.
 * @param {string} oldPassword - Contraseña actual.
 * @param {string} newPassword - Nueva contraseña.
 */
const updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  // Validamos contraseña anterior
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new Error('Contraseña actual incorrecta');
  }
  
  // Actualizamos y disparamos el hook 'pre-save' del modelo para el hashing
  user.password = newPassword;
  await user.save();
  return { message: 'Contraseña actualizada con éxito' };
};

/**
 * Activa o desactiva la autenticación de dos factores (2FA).
 * @param {string} userId - ID del usuario.
 */
const toggle2FA = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  user.twoFA = !user.twoFA;
  await user.save();
  return formatUserResponse(user);
};

/**
 * Maneja el inicio de sesión o registro automático a través de Google.
 * @param {Object} profile - Perfil obtenido de Google OAuth.
 */
const googleLogin = async (profile) => {
  const email = profile.email.toLowerCase();
  let user = await User.findOne({ email });
  
  // Si el usuario no existe, lo creamos (Registro social)
  if (!user) {
    user = await User.create({ 
      nombre: profile.given_name || 'Usuario', 
      apellido: profile.family_name || '',
      email: email, 
      password: Math.random().toString(36), // Contraseña aleatoria para cuentas sociales
      avatar: profile.picture 
    });
  }

  const token = generateToken(user._id);
  return { ...formatUserResponse(user), token };
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  toggle2FA,
  googleLogin
};
