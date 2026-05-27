import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Support } from './components/Support';
import { Home } from './pages/Home';
import { Portal } from './pages/Portal';
import { Forum } from './pages/Forum';
import { SupportPage } from './pages/Support';
import { UserPage } from './pages/User';
import { Catalog } from './pages/Catalog';
import { useAuth } from './context/AuthContext';

/**
 * COMPONENTE PRINCIPAL: App
 * 
 * Gestiona el enrutamiento y la estructura base de la aplicación.
 * Ahora es un componente funcional que utiliza el contexto de autenticación global.
 * Aplica SRP al delegar la gestión del usuario al AuthProvider.
 */
const App: React.FC = () => {
  const { isLoggedIn, user, logout, login, updateUser } = useAuth();

  /**
   * Manejador de navegación para clics en el perfil de usuario.
   * Usamos window.location.href para asegurar una recarga limpia si es necesario, 
   * aunque useNavigate de react-router-dom es preferible dentro de componentes.
   */
  const handleUserClick = () => {
    window.location.href = '/user';
  };

  return (
    <Router>
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-500 font-body">
        {/* Navbar recibe el estado directamente del contexto mediante props o puede usar useAuth internamente */}
        <Navbar 
          isLoggedIn={isLoggedIn} 
          user={user}
          onUserClick={handleUserClick} 
        />
        
        <main className="pt-2">
          <Routes>
            {/* Las páginas reciben el estado de autenticación para su lógica interna */}
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} user={user} />} />
            <Route path="/portal" element={<Portal isLoggedIn={isLoggedIn} user={user} />} />
            <Route path="/forum" element={<Forum isLoggedIn={isLoggedIn} user={user} />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/user" element={
              <UserPage 
                isLoggedIn={isLoggedIn} 
                onLoginSuccess={login} 
                onLogout={logout} 
                onUpdateUser={updateUser} 
                user={user} 
              />
            } />
            <Route path="/catalog" element={<Catalog isLoggedIn={isLoggedIn} user={user} />} />
          </Routes>
        </main>

        <Footer />
        {/* Componente de soporte flotante */}
        <Support />
      </div>
    </Router>
  );
};

export default App;
