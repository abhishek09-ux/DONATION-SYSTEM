import { useScrollAnimation } from '../hooks/useScrollAnimation';

/**
 * Wrapper component that reveals children with animation on scroll
 * @param {string} animation - 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'stagger'
 * @param {number} delay - Animation delay in ms
 * @param {number} threshold - Visibility threshold (0-1)
 */
const ScrollReveal = ({ 
  children, 
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  className = '',
  ...props 
}) => {
  const [ref, isVisible] = useScrollAnimation({ threshold });

  const animationClasses = {
    'fade-up': 'scroll-animate',
    'fade-left': 'scroll-animate-left',
    'fade-right': 'scroll-animate-right',
    'scale': 'scroll-animate-scale',
    'stagger': 'stagger-children'
  };

  const baseClass = animationClasses[animation] || 'scroll-animate';

  return (
    <div
      ref={ref}
      className={`${baseClass} ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
