import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../services/appServices';
import { Star, ChevronRight } from 'lucide-react';

/**
 * COMPONENTE TOP (REFACTORIZADO)
 * 
 * Este componente muestra los proyectos más destacados de la plataforma.
 * Ahora es un componente funcional que consume datos reales de la API
 * y permite la navegación al repositorio detallado en el catálogo.
 */
export const Top: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [topProjects, setTopProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Imágenes de respaldo por si el proyecto no tiene una
  const fallbacks = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600'
  ];

  /**
   * EFECTO: Carga los proyectos destacados al montar el componente.
   */
  useEffect(() => {
    const loadTopProjects = async () => {
      try {
        const data = await projectService.getAll();
        // Ordenamos por estrellas y tomamos los top 3 o 6
        const sorted = (Array.isArray(data) ? data : [])
          .sort((a: any, b: any) => b.stars - a.stars)
          .slice(0, 6);
        setTopProjects(sorted);
      } catch (err) {
        console.error("Error al cargar Top Proyectos:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTopProjects();
  }, []);

  /**
   * Navega al catálogo y selecciona el proyecto para mostrar su repositorio.
   */
  const handleViewProject = (projectId: string) => {
    // Pasamos el ID del proyecto mediante el estado de la navegación
    navigate('/catalog', { state: { selectedProjectId: projectId } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && topProjects.length === 0) return null;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -z-10"></div>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="font-headings text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-white/40 bg-clip-text text-transparent">
            {t('HOME.TOP')}
          </h2>
          <p className="text-slate-500 dark:text-white/40 font-medium mt-2">
            {t('HOME.TOP_PROJECTS.SUBTITLE')}
          </p>
        </div>
        <button 
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:gap-3 transition-all group"
        >
          {t('HOME.TOP_PROJECTS.EXPLORE_ALL')} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {topProjects.map((p, i) => (
          <div 
            key={p._id || i} 
            onClick={() => handleViewProject(p._id)}
            className="group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {/* Imagen del Proyecto */}
            <div className="h-56 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-6">
                <span className="text-white font-bold flex items-center gap-2">
                  {t('HOME.TOP_PROJECTS.VIEW_REPO')} <ChevronRight size={18} />
                </span>
              </div>
              <img 
                src={fallbacks[i % fallbacks.length]} 
                alt={p.nombre} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl border border-white/20 z-20">
                <Star className="text-yellow-400" size={14} fill="currentColor" />
                <span className="text-xs font-black text-slate-900 dark:text-white">{p.stars.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Información del Proyecto */}
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.slice(0, 2).map((tag: string) => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="font-headings text-2xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {p.nombre}
              </h3>
              <p className="font-body text-sm text-slate-500 dark:text-white/50 mb-6 line-clamp-2 leading-relaxed">
                {p.descripcion}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                    <img src={p.usuario?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.nombre}`} alt={p.usuario?.nombre} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-white/60">
                    {p.usuario?.nombre || 'Devvia User'}
                  </span>
                </div>
                <div className="text-blue-500 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-right">
                  {t('HOME.TOP_PROJECTS.EXPLORE')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
