import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { DialogProvider } from './context/DialogContext'
import App from './App'
import './index.css'
import './i18n'

// Reemplaza esto con tu Client ID real de Google Console o usa variables de entorno
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

if (GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID")) {
  console.warn("⚠️ Google Client ID no configurado. El inicio de sesión con Google no funcionará.");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <DialogProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Cargando...</div>}>
            <App />
          </Suspense>
        </GoogleOAuthProvider>
      </DialogProvider>
    </AuthProvider>
  </React.StrictMode>,
)