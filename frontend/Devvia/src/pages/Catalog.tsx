import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { 
  Folder, FileCode, Download, Star, GitFork, ChevronRight, 
  Code2, ArrowLeft, Terminal, Plus, X, Save, Trash2, 
  FileText, Globe, Lock, Hash, Activity, UploadCloud,
  FileCheck, AlertCircle, Pencil
} from 'lucide-react';
import { projectService } from '../services/appServices';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';

/**
 * EXTENSIONES PERMITIDAS
 */
const ALLOWED_EXTENSIONS = [
  'js', 'jsx', 'ts', 'tsx', 'py', 'go', 'rs', 'c', 'cpp', 'h', 'hpp', 
  'java', 'html', 'css', 'scss', 'json', 'md', 'yml', 'yaml', 'sh', 'sql'
];

interface ProjectFile {
  nombre: string;
  contenido: string;
  ruta: string;
}

interface Project {
  _id: string;
  nombre: string;
  descripcion: string;
  tags: string[];
  lenguaje: string;
  usuario: {
    _id: string;
    nombre: string;
    avatar?: string;
  };
  archivos: ProjectFile[];
  stars: number;
  forks: number;
  createdAt: string;
}

export const Catalog: React.FC = () => {
  const { t } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  const { showAlert, showConfirm } = useDialog();
  const location = useLocation();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    nombre: '',
    descripcion: '',
    tagsString: '',
    lenguaje: 'TypeScript',
    publico: true
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [manualFiles, setManualFiles] = useState<ProjectFile[]>([]);
  const [currentManualFile, setCurrentManualFile] = useState({ nombre: '', contenido: '', ruta: '' });
  
  const [isSaving, setIsSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initCatalog = async () => {
      setLoading(true);
      await fetchProjects();
      setLoading(false);
    };
    initCatalog();
  }, [location]);

  useEffect(() => {
    const state = location.state as { selectedProjectId?: string };
    if (state?.selectedProjectId && projects.length > 0) {
      const p = projects.find(p => p._id === state.selectedProjectId);
      if (p) setSelectedProject(p);
    }
  }, [projects, location.state]);

  const fetchProjects = async (): Promise<Project[]> => {
    try {
      const data = await projectService.getAll();
      setProjects(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error("Fetch projects error:", err);
      return [];
    }
  };

  const isValidExtension = (fileName: string) => {
    if (!fileName) return false;
    const parts = fileName.split('.');
    if (parts.length < 2) return false;
    const ext = parts.pop()?.toLowerCase();
    return ext ? ALLOWED_EXTENSIONS.includes(ext) : false;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToList(Array.from(e.dataTransfer.files));
    }
  };

  const addFilesToList = (files: File[]) => {
    const invalidFiles = files.filter(f => !isValidExtension(f.name));
    if (invalidFiles.length > 0) {
      showAlert(`${t('CATALOG.MODAL.INVALID_EXT')}: ${invalidFiles.map(f => f.name).join(', ')}`);
    }

    const validFiles = files.filter(f => isValidExtension(f.name) && f.size <= 5 * 1024 * 1024);
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddManualFile = () => {
    if (!currentManualFile.nombre.trim()) return showAlert(t('CATALOG.MODAL.NEED_NAME'));
    if (!isValidExtension(currentManualFile.nombre)) return showAlert(t('CATALOG.MODAL.INVALID_EXT'));
    
    setManualFiles(prev => [...prev, { ...currentManualFile }]);
    setCurrentManualFile({ nombre: '', contenido: '', ruta: '' });
  };

  const removeManualFile = (index: number) => {
    setManualFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateProject = async () => {
    if (!newProject.nombre.trim()) return showAlert(t('CATALOG.MODAL.NEED_PROJECT_NAME'));
    if (!newProject.descripcion.trim()) return showAlert(t('CATALOG.MODAL.NEED_DESC'));
    
    // En edición no es obligatorio subir archivos nuevos
    if (!editingProject && uploadedFiles.length === 0 && manualFiles.length === 0) {
      return showAlert(t('CATALOG.MODAL.EMPTY_BUFFER'));
    }

    try {
      setIsSaving(true);
      
      const tagsArray = newProject.tagsString.split(',').map(t => t.trim()).filter(t => t !== '');
      
      if (editingProject) {
        // ACTUALIZAR (Metadata solamente en esta versión simplificada)
        await projectService.update(editingProject._id, {
          nombre: newProject.nombre.trim(),
          descripcion: newProject.descripcion.trim(),
          lenguaje: newProject.lenguaje,
          publico: newProject.publico,
          tags: tagsArray
        });
        showAlert(t('CATALOG.PROJECT.UPDATE_SUCCESS'));
      } else {
        // CREAR (Multipart)
        const formData = new FormData();
        formData.append('nombre', newProject.nombre.trim());
        formData.append('descripcion', newProject.descripcion.trim());
        formData.append('lenguaje', newProject.lenguaje);
        formData.append('publico', String(newProject.publico));
        formData.append('tags', JSON.stringify(tagsArray));

        uploadedFiles.forEach(file => {
          formData.append('files', file);
        });

        formData.append('manualFiles', JSON.stringify(manualFiles));
        await projectService.create(formData);
        showAlert(t('CATALOG.MODAL.SUCCESS'));
      }
      
      setShowCreateModal(false);
      resetState();
      await fetchProjects();
    } catch (err: any) {
      console.error("Critical Deployment Error:", err);
      const serverError = err.response?.data;
      const message = serverError?.message || err.message || "Internal Server Error";
      showAlert(`${t('CATALOG.MODAL.DEPLOY_ERROR')}: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProject = (p: Project) => {
    setEditingProject(p);
    setNewProject({
      nombre: p.nombre,
      descripcion: p.descripcion,
      tagsString: p.tags.join(', '),
      lenguaje: p.lenguaje,
      publico: true // Opcional: podrías guardarlo en el modelo
    });
    setShowCreateModal(true);
  };

  const handleDeleteProject = async (id: string) => {
    showConfirm(t('CATALOG.PROJECT.CONFIRM_DELETE'), async () => {
      try {
        await projectService.remove(id);
        showAlert(t('CATALOG.PROJECT.DELETE_SUCCESS'));
        await fetchProjects();
        if (selectedProject?._id === id) setSelectedProject(null);
      } catch (err: any) {
        console.error("Delete project error:", err);
        const msg = err.response?.data?.message || err.message;
        showAlert(`${t('CATALOG.PROJECT.DELETE_ERROR')}: ${msg}`);
      }
    });
  };

  const resetState = () => {
    setEditingProject(null);
    setNewProject({ nombre: '', descripcion: '', tagsString: '', lenguaje: 'TypeScript', publico: true });
    setUploadedFiles([]);
    setManualFiles([]);
    setCurrentManualFile({ nombre: '', contenido: '', ruta: '' });
  };

  const handleDownloadZip = async (id: string, name: string) => {
    try {
      const response = await projectService.downloadZip(id);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name.replace(/\s+/g, '-')}-devvia.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <Activity className="text-blue-500 animate-spin" size={48} />
        <p className="text-blue-200/40 font-mono tracking-widest animate-pulse uppercase text-xs">Sincronizando con Devvia Cloud...</p>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6 animate-in fade-in duration-700 text-left">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => { setSelectedProject(null); setSelectedFile(null); }}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-white/40 dark:hover:text-white transition-all mb-8 font-black group uppercase text-xs tracking-widest"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('CATALOG.PROJECT.BACK')}
          </button>

          <div className="bg-white dark:bg-white/5 rounded-[3.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl backdrop-blur-3xl relative">
            <div className="p-8 md:p-16 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-xl shadow-blue-500/20">
                    <Terminal size={32} />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-headings font-black text-slate-900 dark:text-white leading-none tracking-tighter uppercase">{selectedProject.nombre}</h1>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] font-black uppercase bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/20">{selectedProject.lenguaje}</span>
                       <span className="text-[10px] font-black uppercase text-slate-400">Publicado: {new Date(selectedProject.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-white/50 max-w-3xl text-xl leading-relaxed font-medium">{selectedProject.descripcion}</p>
              </div>
              
              <button 
                onClick={() => handleDownloadZip(selectedProject._id, selectedProject.nombre)}
                className="w-full md:w-auto px-10 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-all active:scale-95"
              >
                <Download size={22} /> {t('CATALOG.PROJECT.DOWNLOAD_SOURCE')}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">
              <div className="lg:col-span-3 border-r border-slate-100 dark:border-white/5 p-8 bg-slate-50/50 dark:bg-white/[0.02]">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-8">{t('CATALOG.PROJECT.FILES_EXPLORER')}</h3>
                <div className="space-y-2">
                  {selectedProject.archivos.map((file, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all ${
                        selectedFile?.nombre === file.nombre 
                        ? 'bg-blue-600 text-white shadow-xl translate-x-2' 
                        : 'text-slate-600 dark:text-white/40 hover:bg-white dark:hover:bg-white/5'
                      }`}
                    >
                      <FileCode size={20} className={selectedFile?.nombre === file.nombre ? 'opacity-100' : 'opacity-30'} />
                      {file.nombre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-9 p-8 bg-white dark:bg-[#08090f] relative">
                {selectedFile ? (
                  <div className="h-full flex flex-col animate-in fade-in duration-500">
                    <div className="flex items-center gap-2 mb-8 text-slate-400 dark:text-white/20 text-[10px] font-black font-mono uppercase tracking-widest bg-slate-50 dark:bg-white/5 w-fit px-4 py-2 rounded-full border border-slate-200 dark:border-white/10">
                      <Folder size={14} className="text-blue-500" /> devvia / storage / {selectedProject.nombre} / {selectedFile.nombre}
                    </div>
                    <div className="flex-1 rounded-[2.5rem] bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-8 overflow-hidden flex flex-col shadow-inner">
                        <pre className="flex-1 font-mono text-sm leading-relaxed text-slate-700 dark:text-blue-100/90 overflow-auto scrollbar-thin scrollbar-thumb-blue-500/20">
                          <code>{selectedFile.contenido}</code>
                        </pre>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                    <Terminal size={120} className="mb-6 text-slate-400 dark:text-white" />
                    <p className="text-2xl font-black uppercase tracking-tighter dark:text-white italic">{t('CATALOG.PROJECT.SELECT_FILE_MSG')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6 transition-colors duration-300 text-left">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-headings font-black text-slate-900 dark:text-white mb-8 leading-none tracking-tighter uppercase italic">
              {t('CATALOG.HEADER.TITLE')}
            </h1>
            <p className="text-2xl text-slate-500 dark:text-white/30 font-medium leading-relaxed">
              {t('CATALOG.HEADER.SUBTITLE')}
            </p>
          </div>
          
          {isLoggedIn && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-black flex items-center gap-3 shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 animate-in slide-in-from-right-10"
            >
              <Plus size={28} strokeWidth={3} /> {t('CATALOG.PROJECT.NEW')}
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((p, i) => (
            <div 
              key={p._id} 
              onClick={() => setSelectedProject(p)}
              className="group p-10 rounded-[3.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 transition-all duration-500 shadow-xl hover:shadow-2xl cursor-pointer animate-in fade-in zoom-in overflow-hidden relative"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* ACCIONES DE PROPIETARIO (Flotantes) */}
              {isLoggedIn && (user?._id === (typeof p.usuario === 'string' ? p.usuario : p.usuario?._id)) && (
                <div className="absolute top-8 right-8 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEditProject(p); }}
                    className="p-3 rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 text-blue-500 hover:bg-blue-600 hover:text-white shadow-xl transition-all"
                    title={t('CATALOG.PROJECT.EDIT')}
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteProject(p._id); }}
                    className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 text-red-500 hover:bg-red-600 hover:text-white shadow-xl transition-all"
                    title={t('CATALOG.PROJECT.DELETE')}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}

              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                 <Terminal size={100} />
              </div>

              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <FileCode size={32} />
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-yellow-400 transition-colors">
                  <Star size={18} className="fill-current" />
                  <span className="text-sm font-black tracking-tighter">{p.stars}</span>
                </div>
              </div>

              <h3 className="text-3xl font-headings font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight line-clamp-1">
                {p.nombre}
              </h3>
              <p className="text-slate-500 dark:text-white/40 text-lg mb-10 line-clamp-2 leading-relaxed h-14 font-medium">
                {p.descripcion}
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {p.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-black uppercase px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 ring-4 ring-transparent group-hover:ring-blue-500/20 transition-all">
                    <img src={p.usuario?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.nombre}`} alt={p.usuario?.nombre} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-[0.1em]">{p.usuario?.nombre}</span>
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                   {t('CATALOG.PROJECT.INSPECT_CODE')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 dark:bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500 text-left">
            <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-white/10 w-full max-w-6xl rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.15)] animate-in zoom-in-95 duration-500 flex flex-col max-h-[95vh]">
              
              <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02] backdrop-blur-xl">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-emerald-500/10 rounded-[2rem] text-emerald-500 border border-emerald-500/20">
                    <UploadCloud size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-headings font-black dark:text-white uppercase tracking-tighter italic">{t('CATALOG.MODAL.TITLE')}</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t('CATALOG.MODAL.SUBTITLE')}</p>
                  </div>
                </div>
                <button onClick={() => { setShowCreateModal(false); resetState(); }} className="p-4 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all text-slate-400"><X size={28} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2"><Terminal size={14} /> {t('CATALOG.MODAL.NAME')}</label>
                    <input 
                      type="text" 
                      placeholder="my-awesome-project"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] px-8 py-5 outline-none focus:border-blue-500 transition-all dark:text-white font-black uppercase tracking-widest text-sm"
                      value={newProject.nombre}
                      onChange={e => setNewProject({...newProject, nombre: e.target.value})}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2"><FileText size={14} /> {t('CATALOG.MODAL.DESC')}</label>
                    <textarea 
                      placeholder="..."
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] px-8 py-6 outline-none focus:border-blue-500 transition-all dark:text-white font-medium text-lg"
                      value={newProject.descripcion}
                      onChange={e => setNewProject({...newProject, descripcion: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2"><Code2 size={14} /> {t('CATALOG.MODAL.LANG')}</label>
                      <select 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] px-6 py-5 outline-none focus:border-blue-500 transition-all dark:text-white font-black appearance-none cursor-pointer uppercase text-xs"
                        value={newProject.lenguaje}
                        onChange={e => setNewProject({...newProject, lenguaje: e.target.value})}
                      >
                        <option value="TypeScript">TypeScript</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Python">Python</option>
                        <option value="Go">Go</option>
                        <option value="HTML">HTML/CSS</option>
                        <option value="Rust">Rust</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2"><Globe size={14} /> {t('CATALOG.MODAL.VISIBILITY')}</label>
                        <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] border border-slate-200 dark:border-white/10">
                            <button 
                              onClick={() => setNewProject({...newProject, publico: true})}
                              className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all ${newProject.publico ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                              {t('CATALOG.MODAL.PUBLIC').toUpperCase()}
                            </button>
                            <button 
                              onClick={() => setNewProject({...newProject, publico: false})}
                              className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all ${!newProject.publico ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                              {t('CATALOG.MODAL.PRIVATE').toUpperCase()}
                            </button>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2"><Hash size={14} /> {t('CATALOG.MODAL.TAGS')}</label>
                    <input 
                      type="text" 
                      placeholder="React, TypeScript, Framer Motion..."
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] px-8 py-5 outline-none focus:border-blue-500 transition-all dark:text-white font-bold"
                      value={newProject.tagsString}
                      onChange={e => setNewProject({...newProject, tagsString: e.target.value})}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col h-full space-y-8">
                   <div 
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative group p-10 rounded-[3rem] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                        dragActive 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.01] hover:border-blue-500/30'
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                   >
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        multiple 
                        accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
                        className="hidden" 
                        onChange={(e) => e.target.files && addFilesToList(Array.from(e.target.files))}
                      />
                      <div className={`p-6 rounded-[2rem] mb-6 transition-all ${dragActive ? 'bg-blue-500 text-white scale-110' : 'bg-slate-200 dark:bg-white/5 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-500/10'}`}>
                         <UploadCloud size={48} />
                      </div>
                      <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter italic mb-2">{t('CATALOG.MODAL.DROP_TITLE')}</h4>
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t('CATALOG.MODAL.DROP_SUB')}</p>
                   </div>

                   <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-4 scrollbar-thin scrollbar-thumb-blue-500/20">
                      {uploadedFiles.length === 0 && manualFiles.length === 0 && (
                        <div className="flex items-center justify-center py-12 text-slate-400 font-black uppercase text-xs tracking-widest opacity-30 gap-3">
                           <AlertCircle size={20} /> {t('CATALOG.MODAL.EMPTY_BUFFER')}
                        </div>
                      )}
                      
                      {uploadedFiles.map((file, i) => (
                        <div key={`up-${i}`} className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 group animate-in slide-in-from-right-4">
                           <div className="flex items-center gap-4">
                              <FileCheck className="text-emerald-500" size={24} />
                              <div>
                                 <p className="text-sm font-black dark:text-white">{file.name}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase">{t('CATALOG.MODAL.FILE_EXTERNAL')} — {(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                           </div>
                           <button onClick={() => removeUploadedFile(i)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      ))}

                      {manualFiles.map((file, i) => (
                        <div key={`man-${i}`} className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-white/5 border border-blue-500/20 group animate-in slide-in-from-right-4">
                           <div className="flex items-center gap-4">
                              <Code2 className="text-blue-500" size={24} />
                              <div>
                                 <p className="text-sm font-black dark:text-white">{file.nombre}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase">{t('CATALOG.MODAL.FILE_INTERNAL')} — {file.contenido.length} chars</p>
                              </div>
                           </div>
                           <button onClick={() => removeManualFile(i)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      ))}
                   </div>

                   <div className="p-8 rounded-[3rem] bg-blue-600/5 border border-blue-500/10 space-y-6 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-[10px] font-black uppercase text-blue-500/50 tracking-widest flex items-center gap-2"><Save size={12} /> {t('CATALOG.MODAL.MANUAL_TITLE')}</span>
                      </div>
                      <input 
                          type="text" 
                          placeholder="filename.tsx"
                          className="w-full bg-white dark:bg-black/30 border border-blue-500/10 rounded-xl px-5 py-4 outline-none text-sm dark:text-white font-mono font-bold"
                          value={currentManualFile.nombre}
                          onChange={e => setCurrentManualFile({...currentManualFile, nombre: e.target.value})}
                      />
                      <textarea 
                          placeholder="..."
                          rows={4}
                          className="w-full bg-white dark:bg-black/30 border border-blue-500/10 rounded-xl px-5 py-4 outline-none text-xs dark:text-blue-100/60 font-mono"
                          value={currentManualFile.contenido}
                          onChange={e => setCurrentManualFile({...currentManualFile, contenido: e.target.value})}
                      />
                      <button 
                          onClick={handleAddManualFile}
                          className="w-full py-4 bg-blue-600 text-white rounded-[1.2rem] font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                      >
                          {t('CATALOG.MODAL.ADD_BUFFER').toUpperCase()}
                      </button>
                   </div>
                </div>
              </div>

              <div className="p-10 border-t border-slate-100 dark:border-white/5 flex gap-6 bg-slate-50/50 dark:bg-white/[0.02]">
                <button 
                  onClick={() => { setShowCreateModal(false); resetState(); }}
                  className="flex-1 py-5 text-slate-400 font-black hover:text-slate-900 dark:hover:text-white transition-all uppercase tracking-[0.2em] text-[10px]"
                >
                  {t('CATALOG.MODAL.CANCEL')}
                </button>
                <button 
                  onClick={handleCreateProject}
                  disabled={isSaving || (uploadedFiles.length === 0 && manualFiles.length === 0)}
                  className="flex-[2] py-5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:grayscale text-white rounded-[2.5rem] font-black shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isSaving ? (
                    <><Activity className="animate-spin" size={24} /> {t('CATALOG.MODAL.SAVING').toUpperCase()}</>
                  ) : (
                    <><Save size={24} /> {t('CATALOG.MODAL.SUBMIT').toUpperCase()}</>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
