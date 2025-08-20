import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function useSmartScrollRestoration(loading, itemCount) {
  const location = useLocation();
  const restored = useRef(false);
  
  // guarda scroll antes de sair da rota
  useEffect(() => {
    return () => {
      sessionStorage.setItem(`scrollPos_${location.pathname}`, window.scrollY);
    };
  }, [location.pathname]);
  
  // tenta restaurar scroll só quando não está carregando e a lista tem itens
  useEffect(() => {
    if (!loading && itemCount > 0 && !restored.current) {
      const scrollY = sessionStorage.getItem(`scrollPos_${location.pathname}`);
      restored.current = true;
      if (scrollY !== null) window.scrollTo(0, Number(scrollY));
    }
  }, [loading, itemCount, location.pathname]);
}
