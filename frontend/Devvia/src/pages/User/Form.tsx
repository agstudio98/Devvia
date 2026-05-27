import React, { useState } from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User as UserIcon, LogIn, UserPlus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { userService } from '../../services/appServices';

/**
 * COMPONENTE: GoogleLoginButton
 * 
 * Botón personalizado para el inicio de sesión con Google.
 * Encapsula la lógica de interacción con la API de Google y el backend de Devvia.
 */
const GoogleLoginButton: React.FC<{ 
  onSuccess: (data: any) => void, 
  onError: (msg: string) => void 
}> = ({ onSuccess, onError }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Obtenemos el perfil directamente de Google usando el access_token
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        
        // Delegamos al userService para el login en nuestro backend
        const backendData = await userService.googleLogin(res.data);
        onSuccess(backendData);
      } catch (err) {
        onError("Fallo en la autenticación con Google");
      }
    },
    onError: () => onError("Error al abrir Google Login")
  });

  return (
    <button 
      type="button"
      onClick={() => login()}
      className="w-full bg-white border border-white/20 text-black rounded-xl py-3 font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-xl shadow-white/5"
    >
       <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" /> Google
    </button>
  );
};

interface UserFormProps {
  onLoginSuccess: (userData: any) => void;
}

/**
 * COMPONENTE: UserForm
 * 
 * Maneja el registro e inicio de sesión de usuarios.
 * Refactorizado a componente funcional utilizando Hooks y centralizando la lógica en servicios.
 * Aplica DIP al no depender directamente de axios sino de userService.
 */
export const UserForm: React.FC<UserFormProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | null; text: string }>({ type: null, text: '' });

  /**
   * Procesa el envío del formulario.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedNombre = nombre.trim();
    const trimmedApellido = apellido.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Validaciones básicas de cliente
    if (!trimmedEmail) {
      setMessage({ type: 'error', text: 'El email es obligatorio' });
      return;
    }
    if (!trimmedPassword) {
      setMessage({ type: 'error', text: 'La contraseña es obligatoria' });
      return;
    }
    if (!isLogin && !trimmedNombre) {
      setMessage({ type: 'error', text: 'El nombre es obligatorio' });
      return;
    }

    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      let data;
      if (isLogin) {
        data = await userService.login({ email: trimmedEmail, password: trimmedPassword });
      } else {
        data = await userService.register({ 
          nombre: trimmedNombre, 
          apellido: trimmedApellido, 
          email: trimmedEmail, 
          password: trimmedPassword 
        });
      }
      
      // Si recibimos un token, el login/registro fue exitoso
      if (data.token) {
        setMessage({ 
          type: 'success', 
          text: isLogin ? '¡Bienvenido de nuevo!' : '¡Cuenta creada y sesión iniciada!' 
        });
        
        // Notificamos éxito después de una breve pausa para mostrar el mensaje
        setTimeout(() => {
          onLoginSuccess(data);
        }, 1000);
      } else {
        // Caso de registro exitoso sin login automático (si el backend cambiara)
        setMessage({ 
          type: 'success', 
          text: 'Cuenta creada con éxito. Ya puedes ingresar.' 
        });
        setIsLogin(true);
        setNombre('');
        setPassword('');
      }
    } catch (err: any) {
      console.error('Error en autenticación:', err);
      const errorMsg = err.response?.data?.message || 'Error de conexión con el servidor';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambia entre el modo de Login y Registro.
   */
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage({ type: null, text: '' });
    setNombre('');
    setApellido('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="max-w-md mx-auto p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl animate-fade-in mt-10">
      <h2 className="font-headings text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
        {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
      </h2>

      {message.type && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-body font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-body opacity-60 mb-2">Nombre</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} />
                <input 
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-400 transition-all" 
                  placeholder="Juan" 
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-body opacity-60 mb-2">Apellido</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} />
                <input 
                  type="text" 
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-400 transition-all" 
                  placeholder="Perez" 
                />
              </div>
            </div>
          </div>
        )}
        <div className="relative">
          <label className="block text-sm font-body opacity-60 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-400 transition-all" 
              placeholder="dev@devvia.com" 
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-body opacity-60 mb-2">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-400 transition-all" 
              placeholder="••••••••" 
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3 font-bold transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30`}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? <><LogIn size={20} /> Ingresar</> : <><UserPlus size={20} /> Registrarse</>)}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4 text-center">
        <p className="text-xs opacity-40 font-body mb-2 uppercase tracking-widest">O continúa con</p>
        <GoogleLoginButton 
          onSuccess={onLoginSuccess}
          onError={(msg) => setMessage({ type: 'error', text: msg })}
        />
        <button 
          type="button"
          onClick={toggleMode}
          className="text-sm text-blue-400 hover:text-blue-300 mx-auto font-bold transition-colors mt-2"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate gratis' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
};
