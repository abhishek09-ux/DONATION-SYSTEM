import { useScrollAnimation, useCountUp } from '../hooks/useScrollAnimation';

/**
 * Animated counter component that counts up when visible
 */
const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '',
  className = ''
}) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.5 });
  const count = useCountUp(end, duration, isVisible);

  return (
    <span ref={ref} className={`counter-number ${className}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
