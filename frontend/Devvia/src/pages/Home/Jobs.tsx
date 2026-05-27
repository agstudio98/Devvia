import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import { jobService, orderService } from '../../services/appServices';
import { useAuth } from '../../context/AuthContext';
import { useDialog } from '../../context/DialogContext';
import { Search, Rocket, Briefcase, MapPin, Star, CheckCircle2 } from 'lucide-react';

/**
 * COMPONENTE JOBS (REFACTORIZADO A FUNCIONAL)
 * 
 * Este componente muestra las ofertas laborales destacadas en la Home.
 * Consume datos reales del backend y permite postulaciones en tiempo real.
 */
export const Jobs: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { showAlert } = useDialog();

  // ESTADOS
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * EFECTO: Carga los empleos y las postulaciones del usuario.
   */
  useEffect(() => {
    const initJobs = async () => {
      try {
        setLoading(true);
        const [jobsData, ordersData] = await Promise.all([
          jobService.getAll(),
          isLoggedIn ? orderService.getMyOrders() : Promise.resolve([])
        ]);

        setJobs(Array.isArray(jobsData) ? jobsData.slice(0, 6) : []);
        
        if (isLoggedIn && Array.isArray(ordersData)) {
          setAppliedJobs(ordersData.map((o: any) => o.empleoId.toString()));
        }
      } catch (err) {
        console.error("Error al inicializar sección de empleos:", err);
      } finally {
        setLoading(false);
      }
    };
    initJobs();
  }, [isLoggedIn]);

  /**
   * MANEJADOR DE POSTULACIÓN
   */
  const handleApply = async (job: any) => {
    if (!isLoggedIn) {
      showAlert(t('PORTAL.MODAL.MUST_LOGIN'));
      navigate('/user');
      return;
    }

    if (appliedJobs.includes(job._id.toString())) return;

    try {
      await orderService.apply({
        empleoId: job._id,
        puesto: job.title,
        empresa: job.company
      });
      setAppliedJobs(prev => [...prev, job._id.toString()]);
      showAlert(`¡Postulación enviada para ${job.title}!`);
    } catch (err) {
      showAlert("Error al enviar postulación.");
    }
  };

  if (loading && jobs.length === 0) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 px-6 py-20 transition-colors duration-300">
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="max-w-2xl text-center md:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold tracking-wider uppercase mb-6">
              Oportunidades Reales
            </span>
            <h2 className="font-headings text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-none">
              {t('HOME.JOBS')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => navigate('/portal')}
                className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Ver todas
             </button>
          </div>
        </div>

        {/* Grilla de empleos reales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((j, i) => {
            const isApplied = appliedJobs.includes(j._id.toString());
            return (
              <div 
                key={j._id} 
                className="group p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 backdrop-blur-xl hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 shadow-xl dark:shadow-none hover:shadow-2xl dark:hover:border-emerald-500/50 relative overflow-hidden animate-in fade-in zoom-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-bold text-emerald-500 shadow-sm">
                    {j.company[0]}
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    <Star size={10} fill="currentColor" />
                    Featured
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className="font-headings text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {j.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-bold">
                      <Briefcase size={14} />
                      {j.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {j.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-8">
                  {j.tags.map((tag: string, index: number) => (
                    <span key={index} className="text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 border border-slate-200 dark:border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/5">
                  <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {j.salary.split(' ')[0]} {j.salary.split(' ')[1]}
                  </span>
                  <button 
                    onClick={() => handleApply(j)}
                    disabled={isApplied}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                      isApplied 
                      ? 'bg-emerald-500/10 text-emerald-500 cursor-default border border-emerald-500/20' 
                      : 'bg-slate-900 dark:bg-white/10 hover:bg-emerald-500 dark:hover:bg-emerald-500 text-white shadow-lg active:scale-95'
                    }`}
                  >
                    {isApplied ? (
                      <><CheckCircle2 size={18} /> Postulado</>
                    ) : (
                      <><Rocket size={18} /> {t('HOME.JOBS_SECTION.APPLY')}</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
