import { useEffect, useState } from 'react';

const ProgressBar = ({ 
  current = 0, 
  goal = 100, 
  showLabels = true,
  showPercentage = true,
  animate = true,
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const [width, setWidth] = useState(0);
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  useEffect(() => {
    if (animate) {
      // Animate the progress bar on mount
      const timer = setTimeout(() => {
        setWidth(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setWidth(percentage);
    }
  }, [percentage, animate]);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    gradient: 'bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500',
  };

  // Dynamic color based on percentage
  const getProgressColor = () => {
    if (color !== 'dynamic') return colorClasses[color] || colorClasses.primary;
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatAmount = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className={className}>
      {/* Progress Bar */}
      <div className={`w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${getProgressColor()} ${sizeClasses[size]} rounded-full transition-all duration-1000 ease-out relative`}
          style={{ width: `${width}%` }}
        >
          {/* Shimmer effect for active progress */}
          {width > 0 && width < 100 && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          )}
        </div>
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between items-center mt-1.5 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {formatAmount(current)} raised
          </span>
          <div className="flex items-center gap-2">
            {showPercentage && (
              <span className={`font-semibold ${
                percentage >= 75 ? 'text-green-600 dark:text-green-400' :
                percentage >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {percentage}%
              </span>
            )}
            <span className="text-gray-500 dark:text-gray-500">
              of {formatAmount(goal)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Mini version for compact spaces
export const MiniProgressBar = ({ current, goal, className = '' }) => {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[32px]">
        {percentage}%
      </span>
    </div>
  );
};

export default ProgressBar;
