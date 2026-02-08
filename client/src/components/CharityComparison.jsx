import { useState } from 'react';
import { FiX, FiPlus, FiStar, FiMapPin, FiUsers, FiHeart, FiTrendingUp, FiCheck, FiMinus } from 'react-icons/fi';
import ProgressBar from './ProgressBar';

const CharityComparison = ({ charities, onRemove, onClose, isOpen = false, maxCompare = 3 }) => {
  if (!isOpen || !charities || charities.length === 0) return null;

  const metrics = [
    { 
      key: 'rating', 
      label: 'Rating', 
      icon: FiStar,
      render: (charity) => (
        <div className="flex items-center gap-1">
          <FiStar className="text-yellow-400 fill-yellow-400" />
          <span className="font-semibold">{charity.rating?.average?.toFixed(1) || 'N/A'}</span>
          <span className="text-gray-400 text-sm">({charity.rating?.count || 0})</span>
        </div>
      )
    },
    { 
      key: 'donors', 
      label: 'Total Donors', 
      icon: FiUsers,
      render: (charity) => (
        <span className="font-semibold">{charity.totalDonors?.toLocaleString() || 0}</span>
      )
    },
    { 
      key: 'donations', 
      label: 'Total Raised', 
      icon: FiTrendingUp,
      render: (charity) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          ₹{(charity.fundingNeeds?.totalRaised || 0).toLocaleString()}
        </span>
      )
    },
    { 
      key: 'progress', 
      label: 'Funding Progress', 
      icon: FiHeart,
      render: (charity) => (
        <ProgressBar
          current={charity.fundingNeeds?.totalRaised || 0}
          goal={charity.fundingNeeds?.totalRequired || 100000}
          size="sm"
          showLabels={false}
          className="w-32"
        />
      )
    },
    { 
      key: 'location', 
      label: 'Location', 
      icon: FiMapPin,
      render: (charity) => (
        <span className="text-sm">
          {charity.location?.city}, {charity.location?.state}
        </span>
      )
    },
    { 
      key: '80g', 
      label: '80G Certified', 
      icon: FiCheck,
      render: (charity) => charity.is80GRegistered ? (
        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <FiCheck /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1 text-gray-400">
          <FiMinus /> No
        </span>
      )
    },
    { 
      key: 'verified', 
      label: 'Verified', 
      icon: FiCheck,
      render: (charity) => charity.verificationStatus === 'verified' ? (
        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
          <FiCheck /> Verified
        </span>
      ) : (
        <span className="flex items-center gap-1 text-gray-400">
          <FiMinus /> Pending
        </span>
      )
    },
    { 
      key: 'causes', 
      label: 'Causes', 
      icon: FiHeart,
      render: (charity) => (
        <div className="flex flex-wrap gap-1">
          {charity.causes?.slice(0, 2).map((cause, i) => (
            <span key={i} className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">
              {cause}
            </span>
          ))}
        </div>
      )
    },
  ];

  // Find the best value for each metric to highlight
  const getBestForMetric = (key) => {
    switch(key) {
      case 'rating':
        return charities.reduce((best, c) => 
          (c.rating?.average || 0) > (best.rating?.average || 0) ? c : best
        )._id;
      case 'donors':
        return charities.reduce((best, c) => 
          (c.totalDonors || 0) > (best.totalDonors || 0) ? c : best
        )._id;
      case 'donations':
        return charities.reduce((best, c) => 
          (c.fundingNeeds?.totalRaised || 0) > (best.fundingNeeds?.totalRaised || 0) ? c : best
        )._id;
      case 'progress':
        return charities.reduce((best, c) => {
          const cProgress = (c.fundingNeeds?.totalRaised || 0) / (c.fundingNeeds?.totalRequired || 1);
          const bestProgress = (best.fundingNeeds?.totalRaised || 0) / (best.fundingNeeds?.totalRequired || 1);
          return cProgress > bestProgress ? c : best;
        })._id;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-5xl max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Compare Charities ({charities.length}/{maxCompare})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Charity Headers */}
            <thead>
              <tr className="border-b dark:border-slate-700">
                <th className="p-4 text-left w-40">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Charity</span>
                </th>
                {charities.map((charity) => (
                  <th key={charity._id} className="p-4 text-center min-w-[200px]">
                    <div className="relative">
                      <button
                        onClick={() => onRemove(charity._id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                      <div className="w-16 h-16 mx-auto rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden mb-2">
                        {charity.logo ? (
                          <img src={charity.logo} alt={charity.organizationName} className="w-full h-full object-cover" />
                        ) : (
                          <FiHeart className="text-primary-500 text-2xl" />
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
                        {charity.organizationName}
                      </h3>
                    </div>
                  </th>
                ))}
                {charities.length < maxCompare && (
                  <th className="p-4 text-center min-w-[200px]">
                    <div className="w-16 h-16 mx-auto rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center mb-2">
                      <FiPlus className="text-gray-400" size={24} />
                    </div>
                    <p className="text-sm text-gray-400">Add charity</p>
                  </th>
                )}
              </tr>
            </thead>

            {/* Metrics */}
            <tbody>
              {metrics.map((metric, index) => {
                const bestId = getBestForMetric(metric.key);
                return (
                  <tr key={metric.key} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-slate-900/50' : ''}>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <metric.icon size={16} />
                        <span className="text-sm font-medium">{metric.label}</span>
                      </div>
                    </td>
                    {charities.map((charity) => (
                      <td 
                        key={charity._id} 
                        className={`p-4 text-center ${bestId === charity._id ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                      >
                        <div className="flex justify-center">
                          {metric.render(charity)}
                        </div>
                      </td>
                    ))}
                    {charities.length < maxCompare && <td className="p-4" />}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            💡 Green highlighted cells indicate the best value for that metric
          </p>
        </div>
      </div>
    </div>
  );
};

// Floating compare button that appears when items are selected
export const CompareFloatingButton = ({ count, onClick, maxCompare = 3 }) => {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-bounce-in">
      <button
        onClick={onClick}
        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all btn-hover-lift"
      >
        <span className="bg-white text-primary-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
          {count}
        </span>
        <span>Compare{count === maxCompare ? ' Now' : ''}</span>
      </button>
    </div>
  );
};

export default CharityComparison;
