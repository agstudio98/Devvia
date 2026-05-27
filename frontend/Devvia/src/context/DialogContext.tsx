import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X, Check, AlertCircle, HelpCircle } from 'lucide-react';

type DialogType = 'alert' | 'confirm';

interface DialogOptions {
  title?: string;
  message: string;
  type?: DialogType;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogContextType {
  showAlert: (message: string, title?: string) => void;
  showConfirm: (message: string, onConfirm: () => void, title?: string, onCancel?: () => void) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions | null>(null);

  const showAlert = (message: string, title: string = 'Atención') => {
    setOptions({ message, title, type: 'alert' });
    setIsOpen(true);
  };

  const showConfirm = (message: string, onConfirm: () => void, title: string = 'Confirmar', onCancel?: () => void) => {
    setOptions({ message, title, type: 'confirm', onConfirm, onCancel });
    setIsOpen(true);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (options?.onConfirm) options.onConfirm();
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (options?.onCancel) options.onCancel();
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {isOpen && options && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${options.type === 'confirm' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {options.type === 'confirm' ? <HelpCircle size={24} /> : <AlertCircle size={24} />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {options.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {options.message}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700/50">
              {options.type === 'confirm' && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors font-medium"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleConfirm}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-500/30 font-bold"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within a DialogProvider');
  return context;
};
