import { useState, useEffect } from 'react';
import { FiHeart, FiBook, FiDroplet, FiHome, FiUsers, FiPackage } from 'react-icons/fi';

// Impact data based on cause and amount
const impactData = {
  education: [
    { threshold: 100, icon: FiBook, text: 'Provides notebooks and pencils for 1 child', plural: 'children' },
    { threshold: 500, icon: FiBook, text: 'Sponsors school supplies for 1 child for a month', plural: 'children' },
    { threshold: 1000, icon: FiBook, text: 'Funds tuition for 1 child for a month', plural: 'children' },
    { threshold: 5000, icon: FiBook, text: 'Provides a scholarship for 1 semester', plural: 'semesters' },
    { threshold: 10000, icon: FiBook, text: 'Equips 1 classroom with learning materials', plural: 'classrooms' },
  ],
  health: [
    { threshold: 100, icon: FiHeart, text: 'Provides basic medicines for 1 patient', plural: 'patients' },
    { threshold: 500, icon: FiHeart, text: 'Funds 1 health checkup camp visit', plural: 'visits' },
    { threshold: 1000, icon: FiHeart, text: 'Covers 1 vaccination for a child', plural: 'children' },
    { threshold: 5000, icon: FiHeart, text: 'Supports 1 surgery for a needy patient', plural: 'surgeries' },
    { threshold: 10000, icon: FiHeart, text: 'Funds 1 month of dialysis treatment', plural: 'months' },
  ],
  environment: [
    { threshold: 50, icon: FiDroplet, text: 'Plants 1 tree', plural: 'trees' },
    { threshold: 200, icon: FiDroplet, text: 'Cleans 1 km of beach/river', plural: 'kms' },
    { threshold: 500, icon: FiDroplet, text: 'Installs 1 rainwater harvesting unit', plural: 'units' },
    { threshold: 2000, icon: FiDroplet, text: 'Creates 1 urban garden', plural: 'gardens' },
    { threshold: 10000, icon: FiDroplet, text: 'Protects 1 acre of forest', plural: 'acres' },
  ],
  food: [
    { threshold: 50, icon: FiPackage, text: 'Provides 1 meal for a hungry person', plural: 'meals' },
    { threshold: 200, icon: FiPackage, text: 'Feeds 1 family for a day', plural: 'families' },
    { threshold: 500, icon: FiPackage, text: 'Provides 1 week of nutrition for a child', plural: 'children' },
    { threshold: 2000, icon: FiPackage, text: 'Supplies 1 month of rations for a family', plural: 'families' },
    { threshold: 5000, icon: FiPackage, text: 'Sets up 1 community kitchen meal', plural: 'meals' },
  ],
  shelter: [
    { threshold: 500, icon: FiHome, text: 'Provides 1 night of shelter', plural: 'nights' },
    { threshold: 2000, icon: FiHome, text: 'Supplies bedding and blankets for 1 family', plural: 'families' },
    { threshold: 5000, icon: FiHome, text: 'Repairs 1 home for a family', plural: 'homes' },
    { threshold: 20000, icon: FiHome, text: 'Builds 1 basic shelter', plural: 'shelters' },
    { threshold: 50000, icon: FiHome, text: 'Constructs 1 permanent home', plural: 'homes' },
  ],
  default: [
    { threshold: 100, icon: FiUsers, text: 'Helps 1 person in need', plural: 'people' },
    { threshold: 500, icon: FiUsers, text: 'Supports 1 family for a week', plural: 'families' },
    { threshold: 1000, icon: FiUsers, text: 'Provides essential support for 1 month', plural: 'months' },
    { threshold: 5000, icon: FiUsers, text: 'Transforms 1 life significantly', plural: 'lives' },
    { threshold: 10000, icon: FiUsers, text: 'Creates lasting impact for 1 community', plural: 'communities' },
  ],
};

const ImpactCalculator = ({ 
  amount, 
  cause = 'default',
  showAnimation = true,
  compact = false,
  className = '' 
}) => {
  const [displayedImpact, setDisplayedImpact] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (amount > 0) {
      if (showAnimation) {
        setIsAnimating(true);
        const timer = setTimeout(() => {
          setDisplayedImpact(calculateImpact(amount, cause));
          setIsAnimating(false);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        setDisplayedImpact(calculateImpact(amount, cause));
      }
    } else {
      setDisplayedImpact(null);
    }
  }, [amount, cause, showAnimation]);

  const calculateImpact = (amount, cause) => {
    const impacts = impactData[cause] || impactData.default;
    
    // Find the best matching impact level
    let bestMatch = impacts[0];
    for (const impact of impacts) {
      if (amount >= impact.threshold) {
        bestMatch = impact;
      } else {
        break;
      }
    }

    // Calculate quantity
    const quantity = Math.floor(amount / bestMatch.threshold);
    
    return {
      ...bestMatch,
      quantity,
      totalAmount: amount,
    };
  };

  if (!displayedImpact || amount <= 0) {
    return null;
  }

  const Icon = displayedImpact.icon;
  const impactText = displayedImpact.quantity > 1 
    ? `${displayedImpact.text.replace('1', displayedImpact.quantity).replace(
        displayedImpact.text.match(/1\s(\w+)/)?.[1] || '',
        displayedImpact.plural
      )}`
    : displayedImpact.text;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Icon className="text-secondary-500 flex-shrink-0" />
        <span className={`text-gray-600 dark:text-gray-400 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          {impactText}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center flex-shrink-0 ${isAnimating ? 'animate-pulse' : ''}`}>
          <Icon className="text-green-600 dark:text-green-400 text-xl" />
        </div>
        <div className={`${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'} transition-all duration-300`}>
          <p className="text-sm text-green-800 dark:text-green-300 font-medium mb-1">
            Your Impact
          </p>
          <p className="text-green-700 dark:text-green-400">
            Your donation of <span className="font-bold">₹{amount.toLocaleString()}</span>
          </p>
          <p className="text-green-600 dark:text-green-500 text-lg font-semibold mt-1">
            {impactText} ✨
          </p>
        </div>
      </div>
    </div>
  );
};

// Static impact preview for donation amounts
export const ImpactPreview = ({ amounts = [500, 1000, 2000, 5000], cause = 'default', onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {amounts.map((amount) => {
        const impact = impactData[cause]?.find(i => amount >= i.threshold) || impactData.default.find(i => amount >= i.threshold);
        const Icon = impact?.icon || FiHeart;
        
        return (
          <button
            key={amount}
            onClick={() => onSelect?.(amount)}
            className="p-3 rounded-lg border-2 border-gray-200 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-500 transition-all hover:shadow-md group text-left"
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className="text-primary-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-gray-900 dark:text-white">₹{amount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {impact?.text || 'Makes a difference'}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default ImpactCalculator;
