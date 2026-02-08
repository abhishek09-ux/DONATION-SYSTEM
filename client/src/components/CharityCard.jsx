import { Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiHeart, FiArrowRight, FiCheck } from 'react-icons/fi';
import ProgressBar from './ProgressBar';

const CharityCard = ({ 
  charity, 
  matchScore, 
  showMatchScore = false,
  showCompare = false,
  isSelected = false,
  onCompareToggle
}) => {
  const causeBadges = {
    education: { label: 'Education', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
    health: { label: 'Health', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
    environment: { label: 'Environment', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
    disaster_relief: { label: 'Disaster Relief', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' },
    women_empowerment: { label: 'Women', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' },
    child_welfare: { label: 'Children', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
    elderly_care: { label: 'Elderly', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    animal_welfare: { label: 'Animals', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300' },
    rural_development: { label: 'Rural Dev', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' },
    poverty_alleviation: { label: 'Poverty', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' }
  };

  const fundingProgress = charity.fundingNeeds?.totalRequired 
    ? Math.round((charity.fundingNeeds.totalRaised / charity.fundingNeeds.totalRequired) * 100)
    : 0;

  return (
    <div className={`card hover:scale-[1.02] transition-all duration-200 relative ${isSelected ? 'ring-2 ring-primary-500 bg-primary-50/50 dark:bg-primary-900/20' : ''}`}>
      {/* Compare Checkbox */}
      {showCompare && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onCompareToggle?.(charity);
          }}
          className={`absolute top-3 left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
            isSelected 
              ? 'bg-primary-600 border-primary-600 text-white' 
              : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-500 hover:border-primary-400'
          }`}
        >
          {isSelected && <FiCheck size={14} />}
        </button>
      )}

      {/* Match Score Badge */}
      {showMatchScore && matchScore && (
        <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {matchScore}% Match
        </div>
      )}

      {/* Logo */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
          {charity.logo ? (
            <img src={charity.logo} alt={charity.organizationName} className="w-full h-full object-cover" />
          ) : (
            <FiHeart className="text-primary-500 dark:text-primary-400 text-2xl" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
            {charity.organizationName}
          </h3>
          {charity.location && (
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
              <FiMapPin className="mr-1" size={14} />
              <span>{charity.location.city}, {charity.location.state}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
        {charity.description || 'Working towards making a positive impact in the community.'}
      </p>

      {/* Causes */}
      <div className="flex flex-wrap gap-2 mb-4">
        {charity.causes?.slice(0, 3).map((cause, index) => {
          const badge = causeBadges[cause] || { label: cause, color: 'bg-gray-100 text-gray-800' };
          return (
            <span key={index} className={`badge ${badge.color}`}>
              {badge.label}
            </span>
          );
        })}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center">
          <FiStar className="text-yellow-400 mr-1" />
          <span className="font-medium text-gray-900 dark:text-white">{charity.rating?.average?.toFixed(1) || 'N/A'}</span>
          <span className="text-gray-400 dark:text-gray-500 ml-1">({charity.rating?.count || 0})</span>
        </div>
        {charity.is80GRegistered && (
          <span className="badge badge-success">80G Certified</span>
        )}
        {charity.verificationStatus === 'verified' && (
          <span className="badge badge-primary">Verified</span>
        )}
      </div>

      {/* Funding Progress */}
      {charity.fundingNeeds?.totalRequired > 0 && (
        <ProgressBar
          current={charity.fundingNeeds.totalRaised || 0}
          goal={charity.fundingNeeds.totalRequired}
          size="sm"
          color="dynamic"
          className="mb-4"
        />
      )}

      {/* Action Button */}
      <Link
        to={`/charities/${charity._id}`}
        className="flex items-center justify-center w-full py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
      >
        <span>View Details</span>
        <FiArrowRight className="ml-2" />
      </Link>
    </div>
  );
};

export default CharityCard;
