import { useState, useCallback } from 'react';
import { supportService } from '../services/appServices';
import { useTranslation } from 'react-i18next';

/**
 * HOOK PERSONALIZADO: useChat (V3 - EQUILIBRADO)
 * 
 * Gestiona el estado del chat permitiendo un historial corto (máximo 10 mensajes)
 * para que las respuestas específicas no se pierdan inmediatamente al hacer clic.
 */

interface Message {
  role: 'bot' | 'user';
  text: string;
}

export const useChat = () => {
  const { t } = useTranslation();
  
  const initialOptions = ["explore_platform", "career_boost", "projects_help", "community_rules", "technical_issue"];
  const welcomeMsg: Message = { role: 'bot', text: 'SUPPORT_BOT.INITIAL_MSG' };
  
  const [chat, setChat] = useState<Message[]>([welcomeMsg]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [showInput, setShowInput] = useState(true);

  const sendMessage = useCallback(async (messageText: string, isOption = false) => {
    if (!messageText || !messageText.trim() || loading) return;

    // 1. Preparar mensaje del usuario
    let displayMsg = messageText;
    try {
      // Si es una opción, usamos la traducción de la etiqueta para el historial visual
      displayMsg = isOption ? t(`SUPPORT_BOT.OPTIONS.${messageText}`) : messageText;
    } catch (e) {
      displayMsg = messageText;
    }
    
    const userMsg: Message = { role: 'user', text: displayMsg };
    
    // 2. Actualización de estado inicial (Carga)
    setLoading(true);
    setOptions([]);
    
    // Añadimos el mensaje del usuario al historial existente
    setChat(prev => {
      const next = [...prev, userMsg];
      return next.slice(-10); // Mantenemos los últimos 10 para no sobrecargar
    });

    try {
      const data = await supportService.chat({
        mensaje: messageText,
        isOption
      });

      // 3. Validación de respuesta del servidor
      if (data) {
        const botMsgText = data.respuestaKey || 'SUPPORT_BOT.FLOW.WELCOME';
        const botMsg: Message = { role: 'bot', text: botMsgText };
        
        setChat(prev => {
          const next = [...prev, botMsg];
          return next.slice(-10);
        });
        setOptions(Array.isArray(data.nextOptions) ? data.nextOptions : []);
        setShowInput(!!data.allowInput);
      }
    } catch (err) {
      console.error("Error en useChat:", err);
      setChat(prev => [...prev, { role: 'bot', text: 'SUPPORT_BOT.FLOW.TECHNICAL_ISSUE' }]);
      setOptions(initialOptions);
    } finally {
      setLoading(false);
    }
  }, [loading, t]);

  const resetChat = useCallback(() => {
    setChat([welcomeMsg]);
    setOptions(initialOptions);
    setShowInput(false);
  }, []);

  return {
    chat: Array.isArray(chat) ? chat : [],
    loading,
    options: Array.isArray(options) ? options : [],
    showInput,
    sendMessage,
    resetChat
  };
};
