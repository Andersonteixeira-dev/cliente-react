import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function useSmartScrollRestoration(loading) {
  const location = useLocation();
  
  // Salva o scroll ao sair
  useEffect(() => {
    return () => {
      sessionStorage.setItem(`scrollPos_${location.key}`, window.scrollY);
    };
  }, [location]);

  // Restaura o scroll após os dados carregarem
  useEffect(() => {
    if (!loading) {
      const scroll = sessionStorage.getItem(`scrollPos_${location.key}`);
      if (scroll !== null) {
        window.scrollTo(0, Number(scroll));
      }
    }
  }, [loading, location]);
}
