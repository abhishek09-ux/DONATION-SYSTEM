import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Start with fade out
    setIsVisible(false);
    
    // After fade out, update children and fade in
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // On mount, fade in immediately
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`page-transition ${isVisible ? 'page-enter-active' : 'page-enter'}`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
