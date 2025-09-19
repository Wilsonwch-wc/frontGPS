import { useEffect } from 'react';

/**
 * Hook personalizado para cambiar el título de la página dinámicamente
 * @param {string} title - El título que se mostrará en la pestaña del navegador
 * @param {string} suffix - Sufijo opcional para el título (por defecto: "SGT - Sistema de Gestión")
 */
const usePageTitle = (title, suffix = 'SGT - Sistema de Gestión') => {
  useEffect(() => {
    const previousTitle = document.title;
    
    // Establecer el nuevo título
    document.title = title ? `${title} | ${suffix}` : suffix;
    
    // Cleanup: restaurar el título anterior cuando el componente se desmonte
    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
};

export default usePageTitle;