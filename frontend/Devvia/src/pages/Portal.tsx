import React, { useState, useEffect, useMemo } from 'react';
import { Filter } from './Portal/Filter';
import { PortalMain } from './Portal/Main';
import { Search, Sparkles, Filter as FilterIcon, X, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { jobService } from '../services/appServices';

/**
 * PÁGINA DEL PORTAL DE TALENTO (REFACTORIZACIÓN DE PAGINACIÓN)
 * 
 * Orquesta la búsqueda, filtrado y una paginación inteligente que muestra
 * solo un rango de páginas útil para el usuario.
 */
export const Portal: React.FC = () => {
  const { t } = useTranslation();

  // ESTADOS
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const jobsPerPage = 6;

  // Categorías para el filtro
  const categories = {
    "Frontend": ["React", "TypeScript", "Tailwind", "Figma", "Next.js"],
    "Backend": ["Node.js", "Express", "MongoDB", "Python", "Go"],
    "Infraestructura": ["AWS", "Docker", "Kubernetes", "DevOps"],
    "Mobile": ["React Native", "Flutter", "Mobile"]
  };

  /**
   * EFECTO: Carga los empleos desde el backend.
   */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await jobService.getAll();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar empleos:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  /**
   * LÓGICA DE FILTRADO
   */
  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
    
    return jobs.filter(job => {
      const title = job.title?.toLowerCase() || '';
      const company = job.company?.toLowerCase() || '';
      const query = searchTerm.toLowerCase();

      const matchesSearch = title.includes(query) || company.includes(query);
      const matchesLocation = !selectedLocation || job.location === selectedLocation;
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => job.tags?.includes(tag));

      return matchesSearch && matchesLocation && matchesTags;
    });
  }, [jobs, searchTerm, selectedLocation, selectedTags]);

  // Lista de ubicaciones únicas para el filtro
  const locations = useMemo(() => {
    const locs = jobs.map(j => j.location).filter(Boolean);
    return Array.from(new Set(locs));
  }, [jobs]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (q: string, l: string, tags: string[]) => {
    setSearchTerm(q);
    setSelectedLocation(l);
    setSelectedTags(tags);
    setCurrentPage(1);
  };

  /**
   * LÓGICA DE PAGINACIÓN INTELIGENTE
   */
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pageNumbers.push(i);

      if (currentPage < totalPages - 2) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-bold uppercase tracking-widest animate-pulse">
        Cargando Portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="bg-white dark:bg-white/5 border-b border-slate-200 dark:border-white/10 pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
            <Sparkles size={14} /> VIP Talento
          </div>
          <h1 className="font-headings text-5xl md:text-7xl font-black mb-6 text-slate-900 dark:text-white">
            {t('PORTAL.HEADER.TITLE')}
          </h1>
          <p className="text-xl text-slate-500 dark:text-white/40 max-w-2xl mx-auto font-medium">
            {t('PORTAL.HEADER.SUBTITLE', { count: filteredJobs.length })}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-80 space-y-6 ${isFilterOpen ? 'fixed inset-0 z-[100] bg-white dark:bg-slate-900 p-8 overflow-y-auto' : 'hidden lg:block'}`}>
            <Filter 
              categories={categories}
              locations={locations}
              onFilterChange={handleFilterChange}
              onClose={() => setIsFilterOpen(false)}
            />
          </aside>

          <main className="flex-1 space-y-12">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder={t('PORTAL.FILTERS.SEARCH_PLACEHOLDER')}
                  value={searchTerm}
                  onChange={(e) => handleFilterChange(e.target.value, selectedLocation, selectedTags)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-blue-500 transition-all dark:text-white"
                />
              </div>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white"
              >
                <FilterIcon />
              </button>
            </div>

            <PortalMain jobs={currentJobs} />

            {/* Paginación Inteligente */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 pt-12">
                <button
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10 hover:border-blue-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="text-slate-400 dark:text-white/20"><MoreHorizontal size={20} /></span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page as number)}
                        className={`w-12 h-12 rounded-xl font-black text-sm transition-all ${
                          currentPage === page 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110' 
                          : 'bg-white dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10 hover:border-blue-500'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}

                <button
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10 hover:border-blue-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
