import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, Building2, Calendar, CheckCircle2, ArrowRight, X, Target, Zap } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { orderService } from '../../services/appServices';
import { useAuth } from '../../context/AuthContext';
import { useDialog } from '../../context/DialogContext';

/**
 * INTERFACES DE DATOS
 */
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  type: string;
  postedAt: string;
}

interface PortalMainProps {
  jobs: Job[];
}

/**
 * COMPONENTE PRINCIPAL DEL PORTAL DE EMPLEO (Refactorizado a Componente Funcional)
 * 
 * Permite a los usuarios visualizar empleos, ver su compatibilidad y postularse.
 * Centraliza la lógica de postulación a través de orderService.
 */
export const PortalMain: React.FC<PortalMainProps> = ({ jobs }) => {
  const { t } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  const { showAlert, showConfirm } = useDialog();

  // ESTADOS LOCALES
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [applying, setApplying] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);

  /**
   * EFECTO: Cargar empleos a los que el usuario ya se ha postulado
   */
  useEffect(() => {
    if (isLoggedIn) {
      fetchAppliedJobs();
    } else {
      setAppliedJobs([]);
    }
  }, [isLoggedIn, user]);

  /**
   * OBTENER POSTULACIONES PREVIAS DEL USUARIO
   */
  const fetchAppliedJobs = async () => {
    try {
      const data = await orderService.getMyOrders();
      // Extraemos solo los IDs de los empleos a los que se postuló (siempre verificando que sea array)
      const appliedIds = Array.isArray(data) ? data.map((order: any) => order.empleoId) : [];
      setAppliedJobs(appliedIds);
    } catch (err) {
      console.error("Error al obtener postulaciones:", err);
      setAppliedJobs([]);
    }
  };

  /**
   * CALCULAR EL PORCENTAJE DE COMPATIBILIDAD (MATCH)
   * Compara las tecnologías del usuario con los tags del empleo.
   */
  const calculateMatch = (jobTags: string[]) => {
    if (!user || !user.tecnologias) return 0;
    
    const userTechs = user.tecnologias.map((t: string) => t.trim().toLowerCase());
    const matches = jobTags.filter(tag => userTechs.includes(tag.trim().toLowerCase()));
    
    return Math.round((matches.length / jobTags.length) * 100);
  };

  /**
   * ABRIR MODAL DE CONFIRMACIÓN
   */
  const handleOpenModal = (job: Job) => {
    if (!isLoggedIn) {
      showAlert(t('PORTAL.MODAL.MUST_LOGIN'));
      window.location.href = '/user';
      return;
    }
    setSelectedJob(job);
    setShowModal(true);
  };

  /**
   * CONFIRMAR Y PROCESAR POSTULACIÓN
   */
  const handleConfirmApply = async () => {
    if (!selectedJob) return;
    const jobId = selectedJob._id || String(selectedJob.id);

    setApplying(jobId);
    setShowModal(false);

    try {
      await orderService.apply({ 
        empleoId: jobId, 
        puesto: selectedJob.title,
        empresa: selectedJob.company
      });

      setAppliedJobs(prev => [...prev, jobId]);
      setApplying(null);
      setSelectedJob(null);
    } catch (err: any) {
      setApplying(null);
      showAlert(err.response?.data?.message || 'Error al postularse');
    }
  };

  const matchScore = selectedJob ? calculateMatch(selectedJob.tags) : 0;

  return (
    <div className="relative">
      {/* Modal de Confirmación Adaptable */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1a1c2e] border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Target className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500 dark:text-white/60">
                  <X size={24} />
                </button>
              </div>

              <h2 className="text-3xl font-headings font-bold mb-2 text-slate-900 dark:text-white">{t('PORTAL.MODAL.TITLE')}</h2>
              <div className="text-slate-500 dark:text-white/60 mb-8 font-body">
                {t('PORTAL.MODAL.DESC', { company: selectedJob.company })}
              </div>

              {/* Score de Match Adaptable */}
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 mb-8 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 dark:bg-white/5">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000" style={{ width: `${matchScore}%` }}></div>
                </div>
                
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className={`text-5xl font-black ${matchScore > 70 ? 'text-emerald-500 dark:text-emerald-400' : matchScore > 40 ? 'text-blue-600 dark:text-blue-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {matchScore}%
                  </div>
                  <div className="text-left">
                    <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400 dark:opacity-40">{t('PORTAL.MODAL.MATCH_LEVEL')}</p>
                    <p className="font-headings font-bold text-lg text-slate-800 dark:text-white">
                      {matchScore > 80 ? t('PORTAL.MODAL.IDEAL') : matchScore > 50 ? t('PORTAL.MODAL.HIGH') : t('PORTAL.MODAL.COMPATIBLE')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {selectedJob.tags.map((tag, idx) => {
                    const isMatch = user?.tecnologias?.some((t: string) => t.trim().toLowerCase() === tag.trim().toLowerCase());
                    return (
                      <span key={`${selectedJob.id}-modal-tag-${idx}`} className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${
                        isMatch 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-slate-200/50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:opacity-30'
                      }`}>
                        {isMatch && <Zap size={10} />} {tag}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleConfirmApply}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  {t('PORTAL.MODAL.CONFIRM')} <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full py-4 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-2xl font-bold transition-all border border-slate-200 dark:border-white/10"
                >
                  {t('PORTAL.MODAL.CANCEL')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
        {jobs.map(job => {
          const jobId = job._id || String(job.id);
          const isApplied = appliedJobs.includes(jobId);
          const isApplying = applying === jobId;
          const currentMatch = calculateMatch(job.tags);

          return (
            <div 
              key={jobId} 
              className="group relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 hover:bg-slate-50 dark:hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className={`absolute -top-3 -right-3 px-4 py-1.5 rounded-full text-xs font-black shadow-lg border-2 z-10 transition-transform group-hover:scale-110 ${
                 currentMatch > 70 ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-blue-600 border-blue-400 text-white'
              }`}>
                {t('PORTAL.JOBS.MATCH', { count: currentMatch })}
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-blue-50 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-emerald-500/20 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="text-blue-600 dark:text-blue-400" size={28} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white dark:opacity-60">
                    {job.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:opacity-40 font-medium">
                    <Calendar size={12} /> {job.postedAt}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-headings font-bold mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <p className="font-body text-slate-500 dark:text-white/60 font-medium flex items-center gap-2">
                  {job.company}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                  <MapPin size={14} className="text-emerald-500 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-white dark:opacity-80">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                  <DollarSign size={14} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-white dark:opacity-80">{job.salary}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-8">
                {job.tags.map((tag, idx) => {
                  const isMatch = user?.tecnologias?.some((t: string) => t.trim().toLowerCase() === tag.trim().toLowerCase());
                  return (
                    <span key={`${jobId}-tag-${idx}`} className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight border transition-colors ${
                      isMatch 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-blue-50 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400/70 border-blue-100 dark:border-blue-500/10'
                    }`}>
                      {tag}
                    </span>
                  );
                })}
              </div>

              <button 
                onClick={() => handleOpenModal(job)}
                disabled={isApplied || isApplying}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  isApplied 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default' 
                  : 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                }`}
              >
                {isApplied ? (
                  <><CheckCircle2 size={20} /> {t('PORTAL.JOBS.APPLIED')}</>
                ) : (
                  isApplying ? t('PORTAL.JOBS.APPLYING') : <><ArrowRight size={20} /> {t('PORTAL.JOBS.APPLY_NOW')}</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 border-dashed">
          <h3 className="text-xl font-headings font-bold text-slate-400 dark:opacity-60">{t('PORTAL.JOBS.NO_RESULTS')}</h3>
        </div>
      )}
    </div>
  );
};
