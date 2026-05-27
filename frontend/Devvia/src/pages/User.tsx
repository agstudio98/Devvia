import React from 'react';
import { UserForm } from './User/Form';
import { GestorUser } from './User/GestorUser';
import { useAuth } from '../context/AuthContext';

/**
 * PÁGINA DE USUARIO
 * 
 * Actúa como controlador para mostrar el formulario de acceso (login/registro)
 * o el gestor de perfil del usuario autenticado.
 * Refactorizado a componente funcional utilizando useAuth.
 */
export const UserPage: React.FC = () => {
  const { isLoggedIn, user, logout, login, updateUser } = useAuth();

  return (
    <div className="py-12 px-6">
      {isLoggedIn ? (
        <GestorUser 
          user={user} 
          onLogout={logout} 
          onUpdateUser={updateUser} 
        />
      ) : (
        <UserForm onLoginSuccess={login} />
      )}
    </div>
  );
};
