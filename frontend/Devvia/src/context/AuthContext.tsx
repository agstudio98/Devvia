import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/appServices';

/**
 * CONTEXTO DE AUTENTICACIÓN
 * 
 * Este contexto provee un estado global para el usuario autenticado en toda la aplicación.
 * Aplica el principio de Inversión de Dependencias (DIP) al centralizar la gestión
 * del usuario en un solo lugar en lugar de pasar props a través de múltiples niveles.
 */

interface AuthContextType {
  user: any | null;
  isLoggedIn: boolean;
  login: (userData: any) => void;
  logout: () => void;
  updateUser: (userData: any) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const isLoggedIn = !!user;

  /**
   * Maneja el inicio de sesión exitoso.
   */
  const login = (userData: any) => {
    const token = userData.token;
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * Cierra la sesión y limpia el almacenamiento local.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('appliedJobs');
    setUser(null);
    window.location.href = '/';
  };

  /**
   * Actualiza los datos del usuario en el estado y localStorage.
   */
  const updateUser = (userData: any) => {
    const updated = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  /**
   * Refresca el perfil del usuario desde el servidor.
   */
  const refreshProfile = async () => {
    try {
      const data = await userService.getProfile();
      updateUser(data);
    } catch (err) {
      console.error("No se pudo refrescar el perfil:", err);
      // Si hay error de autenticación, deslogueamos
      if ((err as any).response?.status === 401) {
        logout();
      }
    }
  };

  // Refrescar perfil al cargar si ya está logueado
  useEffect(() => {
    if (isLoggedIn) {
      refreshProfile();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para acceder fácilmente al contexto de autenticación.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
