import { useEffect, useState, useCallback } from 'react';

// Generate random confetti pieces
const generateConfetti = (count = 150) => {
  const colors = [
    '#f43f5e', // rose
    '#ec4899', // pink
    '#a855f7', // purple
    '#6366f1', // indigo
    '#3b82f6', // blue
    '#22c55e', // green
    '#eab308', // yellow
    '#f97316', // orange
  ];

  const shapes = ['square', 'circle', 'triangle'];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100, // Starting X position (percentage)
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    size: Math.random() * 8 + 4, // Size between 4-12px
    delay: Math.random() * 0.5, // Animation delay
    duration: Math.random() * 2 + 2, // Animation duration 2-4s
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 720, // Rotation during fall
  }));
};

const ConfettiPiece = ({ piece }) => {
  const style = {
    left: `${piece.x}%`,
    width: `${piece.size}px`,
    height: piece.shape === 'circle' ? `${piece.size}px` : `${piece.size * 1.5}px`,
    borderRadius: piece.shape === 'circle' ? '50%' : '2px',
    animationDelay: `${piece.delay}s`,
    animationDuration: `${piece.duration}s`,
    transform: `rotate(${piece.rotation}deg)`,
    borderLeft: piece.shape === 'triangle' ? `${piece.size / 2}px solid transparent` : 'none',
    borderRight: piece.shape === 'triangle' ? `${piece.size / 2}px solid transparent` : 'none',
    borderBottom: piece.shape === 'triangle' ? `${piece.size}px solid ${piece.color}` : 'none',
    backgroundColor: piece.shape === 'triangle' ? 'transparent' : piece.color,
  };

  return (
    <div className="confetti-piece" style={style} />
  );
};

const Confetti = ({ 
  active = false, 
  duration = 4000,
  particleCount = 150,
  onComplete 
}) => {
  const [confetti, setConfetti] = useState([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (active) {
      setIsActive(true);
      setConfetti(generateConfetti(particleCount));

      const timer = setTimeout(() => {
        setIsActive(false);
        setConfetti([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, particleCount, onComplete]);

  if (!isActive || confetti.length === 0) return null;

  return (
    <div className="confetti-container">
      {confetti.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}
    </div>
  );
};

// Hook for triggering confetti
export const useConfetti = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const handleComplete = useCallback(() => {
    setShowConfetti(false);
  }, []);

  return {
    showConfetti,
    triggerConfetti,
    handleComplete,
  };
};

export default Confetti;
