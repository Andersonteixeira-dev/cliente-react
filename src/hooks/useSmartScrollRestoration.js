import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function useSmartScrollRestoration(loading) {
  const { key } = useLocation();
  const scrollPositions = useRef({});

  // Salva a posição ao sair da página
  useEffect(() => {
    return () => {
      scrollPositions.current[key] = window.scrollY;
    };
  }, [key]);

  // Restaura posição só quando loading fica falso (dados carregados)
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (scrollPositions.current[key]) {
          window.scrollTo(0, scrollPositions.current[key]);
        }
      }, 50);
    }
  }, [loading, key]);
}
