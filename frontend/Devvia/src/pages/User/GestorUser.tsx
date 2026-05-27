import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, Settings, User, Shield, Briefcase, Plus, X, Save, Key, Fingerprint, ClipboardList, Building2, Calendar, CheckCircle, Trash2, Loader2 } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { userService, orderService } from '../../services/appServices';
import { useDialog } from '../../context/DialogContext';

interface GestorUserProps {
  user: any;
  onLogout: () => void;
  onUpdateUser: (userData: any) => void;
}

const TECH_OPTIONS = ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind', 'Python', 'Docker', 'AWS', 'Express', 'Vite'];
const PREDEFINED_AVATARS = [
  'https://cdn-icons-png.flaticon.com/512/4140/4140037.png',
  'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
  'https://cdn-icons-png.flaticon.com/512/4140/4140047.png',
  'https://cdn-icons-png.flaticon.com/512/4140/4140061.png',
  'https://cdn-icons-png.flaticon.com/512/4140/4140040.png',
  'https://cdn-icons-png.flaticon.com/512/4140/4140044.png'
];

/**
 * COMPONENTE: GestorUser
 * 
 * Permite al usuario gestionar su perfil, seguridad, tecnologías y ver sus aplicaciones.
 * Refactorizado a componente funcional con Hooks.
 * Aplica DIP al usar userService y orderService para las operaciones de datos.
 */
export const GestorUser: React.FC<GestorUserProps> = ({ user, onLogout, onUpdateUser }) => {
  const { t } = useTranslation();
  const { showAlert, showConfirm } = useDialog();

  // Estado del perfil
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [apellido, setApellido] = useState(user?.apellido || '');
  const [avatar, setAvatar] = useState(user?.avatar || PREDEFINED_AVATARS[0]);
  const [tecnologias, setTecnologias] = useState<string[]>(user?.tecnologias || []);
  
  // Estado de seguridad
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI y otros estados
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'tech' | 'applications'>('personal');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Carga las aplicaciones del usuario.
   */
  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("Error al obtener órdenes:", err);
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /**
   * Sincroniza el estado local con los cambios en las props del usuario.
   */
  useEffect(() => {
    if (user && !loading) {
      setNombre(user.nombre || '');
      setApellido(user.apellido || '');
      setAvatar(user.avatar || PREDEFINED_AVATARS[0]);
      setTecnologias(user.tecnologias || []);
    }
  }, [user, loading]);

  /**
   * Inicia el proceso de eliminación de una aplicación.
   */
  const handleDeleteOrder = (order: any) => {
    showConfirm(
      t('USER.APPLICATIONS.MODAL_DESC_SIMPLE', { puesto: order.puesto, empresa: order.empresa }),
      async () => {
        const id = order._id;
        setDeletingId(id);

        try {
          await orderService.deleteOrder(id);
          setOrders(prev => prev.filter(o => o._id !== id));
          setMessage({ type: 'success', text: t('USER.MESSAGES.DELETE_SUCCESS') });
        } catch (err) {
          setMessage({ type: 'error', text: t('USER.MESSAGES.DELETE_ERROR') });
        } finally {
          setDeletingId(null);
        }
      },
      t('USER.APPLICATIONS.MODAL_TITLE')
    );
  };

  /**
   * Actualiza los datos básicos del perfil.
   */
  const handleUpdateProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const updatedUser = await userService.updateProfile({ 
        nombre, 
        apellido, 
        tecnologias, 
        avatar 
      });
      
      onUpdateUser(updatedUser);
      setMessage({ type: 'success', text: t('USER.MESSAGES.UPDATED') });
      setTechInput('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error al actualizar el perfil' 
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el cambio de contraseña.
   */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: t('USER.MESSAGES.PASS_FIELDS') });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      await userService.changePassword({ oldPassword, newPassword });
      setMessage({ type: 'success', text: t('USER.MESSAGES.PASS_CHANGED') });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error al cambiar la contraseña' 
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Activa o desactiva la autenticación de dos factores.
   */
  const handleToggle2FA = async () => {
    try {
      const response = await userService.toggle2FA();
      onUpdateUser({ ...user, twoFA: response.twoFA });
      showAlert(response.message);
    } catch (err) {
      showAlert(t('USER.MESSAGES.TWOFA_ERROR'));
    }
  };

  /**
   * Añade una tecnología al perfil.
   */
  const addTech = (tech: string) => {
    const trimmed = tech.trim();
    if (trimmed && !tecnologias.includes(trimmed)) {
      setTecnologias(prev => [...prev, trimmed]);
      setTechInput('');
    }
  };

  /**
   * Elimina una tecnología del perfil.
   */
  const removeTech = (tech: string) => {
    setTecnologias(prev => prev.filter(t => t !== tech));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-fade-in relative">
      {/* Header del Perfil */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none backdrop-blur-xl gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/20 overflow-hidden border-2 border-white/10">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.nombre?.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.nombre} {user?.apellido}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all font-bold"
        >
          <LogOut size={18} /> {t('NAV.LOGOUT')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navegación Lateral (Tabs) */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => { setActiveTab('personal'); setMessage({ type: null, text: '' }); }}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all font-bold ${activeTab === 'personal' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/10'}`}
          >
            <User size={20} /> {t('USER.NAV.PERSONAL')}
          </button>
          <button 
            onClick={() => { setActiveTab('applications'); setMessage({ type: null, text: '' }); }}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all font-bold ${activeTab === 'applications' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/10'}`}
          >
            <ClipboardList size={20} /> {t('USER.NAV.APPLICATIONS')}
          </button>
          <button 
            onClick={() => { setActiveTab('security'); setMessage({ type: null, text: '' }); }}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all font-bold ${activeTab === 'security' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/10'}`}
          >
            <Shield size={20} /> {t('USER.NAV.SECURITY')}
          </button>
          <button 
            onClick={() => { setActiveTab('tech'); setMessage({ type: null, text: '' }); }}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all font-bold ${activeTab === 'tech' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/10'}`}
          >
            <Briefcase size={20} /> {t('USER.NAV.TECH')}
          </button>
        </div>

        {/* Contenido de la Tab Activa */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl dark:shadow-none backdrop-blur-xl min-h-[500px]">
            {message.type && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            {activeTab === 'personal' && (
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-slate-900 dark:text-white"><User className="text-blue-600 dark:text-blue-400" /> {t('USER.PERSONAL.TITLE')}</h2>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">{t('USER.PERSONAL.AVATAR')}</label>
                  <div className="flex flex-wrap gap-4">
                    {PREDEFINED_AVATARS.map(url => (
                      <div 
                        key={url}
                        onClick={() => setAvatar(url)}
                        className={`w-16 h-16 rounded-2xl overflow-hidden cursor-pointer border-4 transition-all hover:scale-110 ${avatar === url ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      >
                        <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">{t('USER.PERSONAL.NAME')}</label>
                    <input 
                      type="text" 
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white font-medium"
                      placeholder={t('USER.PERSONAL.NAME_PLACEHOLDER')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">{t('USER.PERSONAL.SURNAME')}</label>
                    <input 
                      type="text" 
                      value={apellido}
                      onChange={e => setApellido(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white font-medium"
                      placeholder={t('USER.PERSONAL.SURNAME_PLACEHOLDER')}
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="mt-4 flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  <Save size={20} /> {loading ? t('USER.PERSONAL.SAVING') : t('USER.PERSONAL.SAVE')}
                </button>
              </form>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-slate-900 dark:text-white"><ClipboardList className="text-blue-600 dark:text-blue-400" /> {t('USER.APPLICATIONS.TITLE')}</h2>
                
                {orders.length === 0 ? (
                  <div className="py-20 text-center bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 border-dashed">
                    <p className="text-slate-400 dark:text-slate-500 italic font-medium">{t('USER.APPLICATIONS.EMPTY')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {orders.map(order => (
                      <div key={order._id} className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all hover:border-blue-500/30">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                            <Building2 className="text-blue-600 dark:text-blue-400" size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{order.puesto}</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-bold mt-0.5">{order.empresa}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-white/10">
                          <div className="text-right">
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest mb-1 flex items-center justify-end gap-1"><Calendar size={10} /> {t('USER.APPLICATIONS.DATE')}</p>
                            <p className="text-sm font-black text-slate-800 dark:text-slate-200">{new Date(order.fecha).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest mb-1">{t('USER.APPLICATIONS.STATUS')}</p>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter">
                              {order.estado}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleDeleteOrder(order)}
                            disabled={deletingId === order._id}
                            className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white transition-all group/btn shadow-sm"
                            title={t('USER.APPLICATIONS.DELETE_TOOLTIP')}
                          >
                            {deletingId === order._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-12">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-slate-900 dark:text-white"><Key className="text-blue-600 dark:text-blue-400" /> {t('USER.SECURITY.TITLE')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">{t('USER.SECURITY.OLD_PASS')}</label>
                      <input 
                        type="password" 
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">{t('USER.SECURITY.NEW_PASS')}</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Confirmar Nueva Contraseña</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-white transition-all active:scale-95"
                  >
                    {t('USER.SECURITY.UPDATE_SEC')}
                  </button>
                </form>
                <div className="pt-8 border-t border-slate-100 dark:border-white/10">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-900 dark:text-white"><Fingerprint className="text-emerald-600 dark:text-emerald-400" /> {t('USER.SECURITY.TWOFA_TITLE')}</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm font-bold">{t('USER.SECURITY.TWOFA_DESC')}</p>
                  <button 
                    onClick={handleToggle2FA}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 ${user?.twoFA ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10'}`}
                  >
                    {user?.twoFA ? t('USER.SECURITY.TWOFA_ON') : t('USER.SECURITY.TWOFA_OFF')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'tech' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-900 dark:text-white"><Briefcase className="text-blue-600 dark:text-blue-400" /> {t('USER.TECH.TITLE')}</h2>
                
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Tus Conocimientos</label>
                  <div className="flex flex-wrap gap-3 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 min-h-[100px]">
                    {tecnologias.map(t => (
                      <span key={t} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold animate-in zoom-in duration-200">
                        {t} <X size={14} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => removeTech(t)} />
                      </span>
                    ))}
                    {tecnologias.length === 0 && <p className="text-slate-400 dark:text-slate-500 italic font-medium">{t('USER.TECH.EMPTY')}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t('USER.TECH.SUGGESTIONS')}</p>
                    <div className="flex flex-wrap gap-2">
                      {TECH_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => addTech(opt)}
                          disabled={tecnologias.includes(opt)}
                          className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500 text-slate-600 dark:text-white/70 hover:text-blue-600 transition-all text-sm font-bold disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Agregar otro</p>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTech(techInput)}
                        placeholder="Ej: Rust, GraphQL..."
                        className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white font-medium"
                      />
                      <button 
                        onClick={() => addTech(techInput)}
                        className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleUpdateProfile()}
                  disabled={loading}
                  className="mt-8 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Save size={20} /> {loading ? t('USER.PERSONAL.SAVING') : t('USER.TECH.CONFIRM')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
